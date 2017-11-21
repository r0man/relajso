(ns relajso.core
  (:require [cljs.analyzer :as ana]
            [cljs.core :refer [js-arguments specify! this-as]]
            [clojure.spec.alpha :as s]
            [inflections.core :refer [hyphenate]]
            [relajso.compiler :as compiler]
            [relajso.specs :as specs])
  (:import cljs.tagged_literals.JSValue))

(defn compile-document
  "Compile the GraphQL `document` using `schema`. Saves the compiled
  document in `cache` and returns it."
  [compiler schema cache document]
  (compiler/compile-document compiler schema cache document))

(defn conform!
  "Like `clojure.spec.alpha/conform`, but raises an exception if `data`
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

(defn- find-protocol
  [env ast protocol]
  (->> (:methods ast)
       (map second)
       (filter (fn [ast]
                 ;; TODO: What do to when env is not available? At
                 ;; macro expansion time, for example.
                 (or (= (:protocol ast) protocol)
                     (some-> env
                             (dissoc :locals)
                             (ana/resolve-var (:protocol ast))
                             (:name)
                             (= protocol)))))
       (last)))

(defn- find-method [env ast protocol method]
  (when-let [{:keys [methods]} (find-protocol env ast protocol)]
    (last (filter #(= (:name %) method) methods))))

;; defcomponent

(defn- emit-factory-fn [ast]
  `(defn ~(hyphenate (:name ast)) [~'props]
     (js/React.createElement ~(:name ast) ~'props)))

(defn- emit-prototype-methods [ast]
  (reduce (fn [code {:keys [protocol methods]}]
            (concat
             `(~protocol
               ~@(for [{:keys [name args body]} methods]
                   `(~name ~args ~@body)))
             code))
          nil (protocol-methods ast)))

(defn- emit-context-types [ast]
  `(set! (.-contextTypes ~(:name ast)) ~'relajso.core/relay-context-types))

(defn defcomponent*
  ([class-sym methods]
   (defcomponent* nil class-sym methods))
  ([env class-sym methods]
   (let [methods (conform! ::specs/defui-method-list methods)
         ast {:name class-sym :methods methods}
         rname (if env
                 (:name (ana/resolve-var (dissoc env :locals) class-sym))
                 class-sym)
         ctor  `(defn ~(with-meta class-sym
                         (merge {:jsdoc ["@constructor"]}
                                (meta class-sym)
                                (when (:doc ast)
                                  {:doc (:doc ast)})))
                  []
                  (this-as this#
                    (.apply js/React.Component this# (js-arguments))
                    (if-not (nil? (.-initLocalState this#))
                      (set! (.-state this#) (.initLocalState this#))
                      (set! (.-state this#) (cljs.core/js-obj)))
                    this#))
         set-react-proto! `(set! (.-prototype ~class-sym)
                                 (goog.object/clone js/React.Component.prototype))
         ctor  (if (-> ast :name meta :once)
                 `(when-not (cljs.core/exists? ~class-sym)
                    ~ctor
                    ~set-react-proto!)
                 `(do
                    ~ctor
                    ~set-react-proto!))
         display-name (if env
                        (str (-> env :ns :name) "/" class-sym)
                        'js/undefined)]
     `(do
        ~ctor
        (specify! (.-prototype ~class-sym) ~@(emit-prototype-methods ast))
        (set! (.. ~class-sym -prototype -constructor) ~class-sym)
        (set! (.. ~class-sym -prototype -constructor -displayName) ~display-name)
        (set! (.-cljs$lang$type ~rname) true)
        (set! (.-cljs$lang$ctorStr ~rname) ~(str rname))
        (set! (.-cljs$lang$ctorPrWriter ~rname)
              (fn [this# writer# opt#]
                (cljs.core/-write writer# ~(str rname))))
        ~(emit-context-types ast)
        ~(emit-factory-fn ast)))))

(defmacro defcomponent
  "Define a React component."
  [name & methods]
  (defcomponent* &env name methods))

(defn- emit-fragment-container
  "Emit a Relay fragment container."
  [env ast]
  (when-let [method (find-method env ast 'relajso.core/IFragments 'fragments)]
    `(do (def ~(:name ast)
           (js/ReactRelay.createFragmentContainer
            ~(:react-sym ast)
            ((fn ~(:args method)
               ~@(:body method))
             ~(:react-sym ast))))
         (defn ~(hyphenate (:name ast)) [~'props]
           (js/React.createElement ~(:name ast) ~'props)))))

(defn- emit-query-renderer
  "Emit a Relay query renderer."
  [env ast]
  (when-let [method (find-method env ast 'relajso.core/IQueryRenderer 'query)]
    `(defn ~(hyphenate (:name ast))
       [{:keys [~'env ~'vars]}]
       (js/React.createElement
        js/ReactRelay.QueryRenderer
        ~(JSValue. `{:environment ~'env
                     :variables ~'vars
                     :render #(js/React.createElement ~(:react-sym ast) %)
                     :query ((fn ~(:args method)
                               ~@(:body method))
                             ~(:react-sym ast))})))))

;; defui

(defn defui*
  "Define a Relay component."
  ([form]
   (defui* nil name methods))
  ([env class-sym methods]
   (let [react-sym (symbol (str "React" class-sym ))
         ast {:name class-sym
              :react-sym react-sym
              :methods (conform! ::specs/defui-method-list methods)}]
     `(do (relajso.core/defcomponent ~react-sym ~@methods)
          ~(emit-fragment-container env ast)
          ~(emit-query-renderer env ast)))))

(defmacro defui
  "Define a Relay component."
  [class-sym & methods]
  (defui* &env class-sym methods))
