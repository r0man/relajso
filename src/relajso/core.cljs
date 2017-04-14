(ns relajso.core
  (:refer-clojure :exclude [get])
  (:require-macros relajso.core)
  (:require [goog.object :as obj]
            [cljs.pprint :refer [pprint]]))

(defprotocol IEnv
  (env [obj] "Returns the Relay environment from `obj`."))

(defprotocol IFragments
  (fragments [this] "Return the fragments of the component."))

(defprotocol IQueryRenderer
  (query [this] "Return the query of the container."))

(def default-store
  "The default Relay store."
  (js/RelayRuntime.Store. (js/RelayRuntime.RecordSource.)))

(def relay-context-types
  "The Relay context types for a React component."
  ;; TODO: Use Relay prop type.
  #js {:relay js/React.PropTypes.object})

(defn get
  "Lookup the value under `ks` in `obj`."
  [obj & ks]
  (apply obj/getValueByKeys obj (map name ks)))

(defmulti handler-provider
  "Returns a Relay handler provider for `name`."
  (fn [name] (keyword name)))

(defn mutate
  "Execute the Relay `mutation` with `variables`."
  [component mutation variables & [{:keys [on-completed on-error]}]]
  (js/RelayRuntime.commitMutation
   (env component)
   #js {:mutation mutation
        :variables (clj->js variables)
        :onCompleted on-completed
        :onError on-error}))

;; Environment

(defn- make-env
  "Make a new Relay environment according to `config`."
  [& [{:keys [handler-provider network store] :as config}]]
  (js/RelayRuntime.Environment.
   #js {:handlerProvider
        (or handler-provider
            ;; Needs to be wrapped in a fn, because Relay doesn't know
            ;; what a multi methods is.
            #(relajso.core/handler-provider %))
        :network network
        :store (or store default-store)}))

(extend-protocol IEnv
  PersistentArrayMap
  (env [config]
    (make-env config))

  PersistentHashMap
  (env [config]
    (make-env config))

  js/React.Component
  (env [component]
    (get component :context :relay :environment)))

;; Network

(defmethod handler-provider :connection [_]
  js/RelayRuntime.ConnectionHandler)

(defmethod handler-provider :viewer [_]
  js/RelayRuntime.ViewerHandler)

(defmethod handler-provider :default [name]
  (.log js/error (str "No Relay handler provider defined for: " name)))

(defn network
  "Returns a new Relay network for `url`."
  [url]
  (js/RelayRuntime.Network.create
   (fn [operation variables cache-config observer]
     (let [query (get operation :text)]
       ;; (println "Query:")
       ;; (println query)
       ;; (println "Variables:" variables)
       (-> (js/fetch
            url #js {:method "POST"
                     :headers #js {"content-type" "application/json"}
                     :body
                     (js/JSON.stringify
                      #js {:query (get operation :text)
                           :variables variables})})
           (.then #(.json %))
           (.catch #(do (println "Fetch error:")
                        (.log js/console %)
                        (throw %))))))))
