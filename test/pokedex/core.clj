(ns pokedex.core
  (:require [clojure.java.io :as io]
            [clojure.java.shell :refer [sh]]
            [cljs.core :refer [this-as js-arguments specify!]]
            [om.next :as om]
            [clojure.string :as str]
            [cljs.analyzer :as ana]
            [cljs.analyzer.api :as ana-api]
            [clojure.spec :as s]
            [me.raynes.conch :as conch]))

(defprotocol IFragments
  (fragments [this] "Return the component's data requirements using
  fragments."))

(defprotocol IInitVars
  (init-vars [this] "Return the initial set of variable values
  available to this component's fragments."))

(defprotocol IPrepareVars
  (prepare-vars [this] "A method to modify the variables based on the
  runtime environment or previous variable values."))

(defn- trim-newline [s]
  (str/replace s #"\r\n|\n|\r" " "))

(defn- ql* [env query]
  (let [filename (-> env :ns :name)
        {:keys [line column]} env
        code (str  "/* " filename " " line " " column "*/" ; unique key for every query
                   "Relay.QL`" (trim-newline query) "`;")
        schema (-> "burningswell.json" io/resource slurp) ; GraphQL schema from introspection query
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
    (try (conch/execute "node" "--print" script)
         (catch Exception e
           (println (-> e ex-data :stderr))
           (throw (ex-info (-> e ex-data :stderr) {}))))))

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

;; defui

(s/def ::defui-method-impl
  (s/cat :name symbol?
         :args vector?
         :body (s/* any?)))

(s/def ::defui-method
  (s/and list? ::defui-method-impl))

(s/def ::defui-static-methods
  (s/cat :static #(= 'static %)
         :protocol symbol?
         :methods (s/+ ::defui-method)))

(s/def ::defui-protocol-methods
  (s/cat :protocol symbol?
         :methods (s/+ ::defui-method)))

(s/def ::defui-methods
  (s/alt :static ::defui-static-methods
         :protocol ::defui-protocol-methods))

(s/def ::defui
  (s/cat :defui #(= 'defui %)
         :name symbol?
         :doc (s/? string?)
         :methods (s/* ::defui-methods)))

(defn parse-ui [form]
  (conform! ::defui form))

#_(defn defui*
    ([name form] (defui* name form nil))
    ([name forms env]
     (letfn [(field-set! [obj [field value]]
               `(set! (. ~obj ~(symbol (str "-" field))) ~value))]
       (let [docstring (when (string? (first forms))
                         (first forms))
             forms (cond-> forms
                     docstring rest)
             ;; {:keys [dt statics]} (collect-statics forms)
             ;; _ (validate-statics dt)
             rname (if env
                     (:name (ana/resolve-var (dissoc env :locals) name))
                     name)
             ctor  `(defn ~(with-meta name
                             (merge {:jsdoc ["@constructor"]}
                                    (meta name)
                                    (when docstring
                                      {:doc docstring})))
                      []
                      (this-as this#
                        (.apply js/React.Component this# (js-arguments))
                        (if-not (nil? (.-initLocalState this#))
                          (set! (.-state this#) (.initLocalState this#))
                          (set! (.-state this#) (cljs.core/js-obj)))
                        this#))
             set-react-proto! `(set! (.-prototype ~name)
                                     (goog.object/clone js/React.Component.prototype))
             ctor  (if (-> name meta :once)
                     `(when-not (cljs.core/exists? ~name)
                        ~ctor
                        ~set-react-proto!)
                     `(do
                        ~ctor
                        ~set-react-proto!))
             display-name (if env
                            (str (-> env :ns :name) "/" name)
                            'js/undefined)]
         `(do
            ~ctor
            ;; (specify! (.-prototype ~name) ~@(reshape dt reshape-map))
            (set! (.. ~name -prototype -constructor) ~name)
            (set! (.. ~name -prototype -constructor -displayName) ~display-name)
            .            (set! (.. ~name -prototype -om$isComponent) true)
            ;; ~@(map #(field-set! name %) (:fields statics))
            ;; (specify! ~name
            ;;   ~@(mapv #(cond-> %
            ;;              (symbol? %) (vary-meta assoc :static true)) (:protocols statics)))
            ;; (specify! (. ~name ~'-prototype) ~@(:protocols statics))
            (set! (.-cljs$lang$type ~rname) true)
            (set! (.-cljs$lang$ctorStr ~rname) ~(str rname))
            (set! (.-cljs$lang$ctorPrWriter ~rname)
                  (fn [this# writer# opt#]
                    (cljs.core/-write writer# ~(str rname)))))))))

(def my-ast
  '{:defui defui,
    :name MySpot,
    :methods
    [[:protocol
      {:protocol Object,
       :methods
       [{:name componentDidMount,
         :args [this],
         :body [(.log js/console "did mount")]}
        {:name render, :args [this], :body ["Hello world"]}]}]]})

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

(defn filter-protocol
  [ast protocol]
  (->> (:methods ast)
       (map second)
       (filter #(= (:protocol %) protocol))))

(defn compile-fragments
  [ast]
  (let [{:keys [static protocol methods]}
        (last (filter-protocol ast 'IFragments))
        method (last (filter #(= (:name %) 'fragments) methods))]
    `(fn ~(:name method) ~(:args method) ~@(:body method))
    `(fn ~(:args method) ~@(:body method))))

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
        ;; (specify! (.-prototype ~name) ~@(reshape dt reshape-map))
        (specify! (.-prototype ~react-class) ~@(compile-protocol-methods ast))
        (set! (.. ~react-class -prototype -constructor) ~react-class)
        (set! (.. ~react-class -prototype -constructor -displayName) ~display-name)
        ;; ~@(map #(field-set! react-class %) (:fields statics))
        ;; (specify! ~react-class
        ;;   ~@(mapv #(cond-> %
        ;;              (symbol? %) (vary-meta assoc :static true)) (:protocols statics)))
        ;; (specify! (. ~react-class ~'-prototype) ~@(:protocols statics))
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
            (cljs.core/clj->js (~(compile-fragments ast) ~react-class)))))))))

(defmacro defui [& form]
  (defui* (cons 'defui form) &env))

(comment

  (clojure.pprint/pprint
   (om/defui*
     'HelloWorld
     '(Object
       (render [this]
         (dom/div nil "Hello, world!")))))


  (defui MySpot
    static IFragments
    (fragments [this]
      {:spot #(ql "fragment on Spot { id name }")})

    Object
    (render [this]
      (.log js/console "render")
      (html [:div "MySpot"])))

  (clojure.pprint/pprint
   (conform!
    ::defui
    '(defui MySpot
       static relay/IFragments
       (fragments [this]
         {:spot "fragment on Spot { name }"})

       Object
       (render [this]
         1)
       ))))
