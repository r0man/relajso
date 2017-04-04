(ns relajso.core
  (:require [cljs.analyzer :as ana]
            [cljs.util :as cljs-util]
            [cljs.core :refer [js-arguments specify! this-as]]
            [clojure.java.io :as io]
            [clojure.spec :as s]
            [clojure.string :as str]
            [me.raynes.conch :as conch]
            [relajso.specs :as specs]))

(defn- trim-newline [s]
  (str/replace s #"\r\n|\n|\r" " "))

(defn- ql* [env query]
  (let [filename (-> env :ns :name)
        {:keys [line column]} env
        code (str  "/* " filename " " line " " column "*/" ; unique key for every query
                   "Relay.QL`" (trim-newline query) "`;")
        schema (-> "schema.json" io/resource slurp) ; GraphQL schema from introspection query
        script (str "var schema = " schema ";"
                    "var schemaData = schema.data;"
                    "var getBabelRelayPlugin = require('babel-relay-plugin');"
                    "var babel = require('babel-core');"
                    "var code = '" code "';"
                    "var options = {};"
                    "options.plugins = [getBabelRelayPlugin(schemaData)];"
                    "options.filename = '" filename "';"
                    "options.compact = true;"
                    "options.comments = false;"
                    "babel.transform(code, options).code;")]
    (try (conch/execute "node" "--print" {:in script})
         (catch Exception e
           (println (-> e ex-data :stderr))
           (throw (ex-info (str "Can't parse GraphQL fragment: " (.getMessage e))
                           (ex-data e)))))))

(defmacro ql [^String query]
  `(js/eval ~(ql* &env query)))

(defn conform!
  "Like `clojure.spec/conform`, but raises an exception if `data`
  doesn't conform to `spec`."
  [spec data]
  (let [result (s/conform spec data)]
    (if (= result ::s/invalid)
      (let [problems (s/explain-data spec data)]
        (clojure.pprint/pprint problems)
        ;; (throw (ex-info "Can't conform data to spec." problems))
        )
      result)))

(defn parse-ui [form]
  (conform! ::specs/defui form))

(defn static-methods [ast]
  (->> (:methods ast)
       (filter #(= (first %) :static))
       (map second)))

(defn protocol-methods [ast]
  (->> (:methods ast)
       (filter #(= (first %) :protocol))
       (map second)))

(defn compile-protocol-methods [ast]
  (reduce (fn [code {:keys [protocol methods]}]
            (concat
             `(~protocol
               ~@(for [{:keys [name args body]} methods]
                   `(~name ~args ~@body)))
             code))
          nil (protocol-methods ast)))

(defn- find-protocol
  [env ast protocol]
  (->> (:methods ast)
       (map second)
       (filter (fn [ast]
                 ;; TODO: What do to when env is not available? At
                 ;; macro expansion time, for example.
                 (some-> env
                         (dissoc :locals)
                         (ana/resolve-var (:protocol ast))
                         (:name)
                         (= protocol))))
       (last)))

(defn- find-method [env ast protocol method]
  (when-let [{:keys [methods]} (find-protocol env ast protocol)]
    (last (filter #(= (:name %) method) methods))))

;; Fragments

(defn- find-fragments [env ast]
  (find-method env ast 'relajso.core/IFragments 'fragments))

(defn- compile-fragments
  [env ast class]
  (when-let [method (find-fragments env ast)]
    `(cljs.core/clj->js
      ((fn ~(:args method)
         ~@(:body method))
       ~class))))

;; Initial Variables

(defn- find-initial-variables [env ast]
  (find-method env ast 'relajso.core/IInitialVariables 'initial-variables))

(defn- compile-initial-variables
  [env ast class]
  (when-let [method (find-initial-variables env ast)]
    `(cljs.core/clj->js
      ((fn ~(:args method)
         ~@(:body method))
       ~class))))

;; Prepare Variables

(defn- find-prepare-variables [env ast]
  (find-method env ast 'relajso.core/IPrepareVariables 'prepare-variables))

(defn- compile-prepare-variables
  [env ast class]
  (when-let [method (find-prepare-variables env ast)]
    `(fn [previous-variables#]
       (cljs.core/clj->js
        ((fn ~(:args method)
           ~@(:body method))
         ~class (cljs.core/js->clj
                 previous-variables#
                 :keywordize-keys true))))))

(defn defui*
  ([form]
   (defui* form nil))
  ([form env]
   (let [ast (parse-ui form)
         react-class (symbol (str (:name ast) "React"))
         relay-class (:name ast)
         rname (if env
                 (:name (ana/resolve-var (dissoc env :locals) react-class))
                 react-class)
         ctor  `(defn ~(with-meta react-class
                         (merge {:jsdoc ["@constructor"]}
                                (meta react-class)
                                (when (:doc ast)
                                  {:doc (:doc ast)})))
                  []
                  (this-as this#
                    (.apply js/React.Component this# (js-arguments))
                    (if-not (nil? (.-initLocalState this#))
                      (set! (.-state this#) (.initLocalState this#))
                      (set! (.-state this#) (cljs.core/js-obj)))
                    this#))
         set-react-proto! `(set! (.-prototype ~react-class)
                                 (goog.object/clone js/React.Component.prototype))
         ctor  (if (-> ast :name meta :once)
                 `(when-not (cljs.core/exists? ~react-class)
                    ~ctor
                    ~set-react-proto!)
                 `(do
                    ~ctor
                    ~set-react-proto!))
         display-name (if env
                        (str (-> env :ns :name) "/" react-class)
                        'js/undefined)]
     `(do
        ~ctor
        (specify! (.-prototype ~react-class) ~@(compile-protocol-methods ast))
        (set! (.. ~react-class -prototype -constructor) ~react-class)
        (set! (.. ~react-class -prototype -constructor -displayName) ~display-name)
        (set! (.-cljs$lang$type ~rname) true)
        (set! (.-cljs$lang$ctorStr ~rname) ~(str rname))
        (set! (.-cljs$lang$ctorPrWriter ~rname)
              (fn [this# writer# opt#]
                (cljs.core/-write writer# ~(str rname))))
        (def ~(with-meta relay-class {:export true})
          (js/Relay.createContainer
           ~react-class
           (cljs.core/js-obj
            "fragments"
            ~(compile-fragments env ast react-class)
            "initialVariables"
            ~(compile-initial-variables env ast react-class)
            "prepareVariables"
            ~(compile-prepare-variables env ast react-class))))))))

(defmacro defui [& form]
  (defui* (cons 'defui form) &env))
