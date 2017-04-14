(ns relajso.plain
  ;; (:require-macros [relajso.core :refer [defui ql]])
  ;; (:require [rum.core :as rum]
  ;;           [sablono.core :refer [html]]
  ;;           ;; [cljsjs.react-relay]
  ;;           )
  )

(enable-console-print!)

;; (defprotocol IFragments
;;   (fragments [this] "Return the component's data requirements using
;;   fragments."))

;; (defonce network-injection
;;   (js/Relay.injectNetworkLayer
;;    (js/Relay.DefaultNetworkLayer. "http://localhost:7000/graphql")))

;; (def Spot'
;;   (js/React.createClass
;;    #js {:render
;;         (fn []
;;           (this-as this
;;             (js/React.createElement
;;              "div" nil
;;              (.. this -props -spot -name))))}))

;; (def ^:export Spot
;;   (->> #js {:fragments #js {:spot #(ql "fragment on Spot { id name }")}}
;;        (js/Relay.createContainer Spot')))

;; (def SpotPage'
;;   (js/React.createClass
;;    #js {:render
;;         (fn []
;;           (this-as this
;;             (js/React.createElement
;;              "div" nil
;;              "SPOT PAGE"
;;              (js/React.createElement "div" nil (.. this -props -viewer -user-agent))
;;              (into-array
;;               (for [edge (.. this -props -viewer -spots -edges)]
;;                 (js/React.createElement Spot #js{:key (.. edge -node -id)
;;                                                  :spot (.. edge -node)}))))))}))

;; (def ^:export SpotPage
;;   (->> #js {:fragments
;;             #js {:viewer
;;                  #(ql "fragment on Viewer {
;;                          user_agent
;;                          spots {
;;                            edges {
;;                              node {
;;                                id
;;                                ${relajso.core.Spot.getFragment(\"spot\")} } } } }")}}
;;        (js/Relay.createContainer
;;         (js/React.createClass
;;          #js {:render
;;               (fn []
;;                 (this-as this
;;                   (js/React.createElement
;;                    "div" nil
;;                    "SPOT PAGE"
;;                    (js/React.createElement "div" nil (.. this -props -viewer -user-agent))
;;                    (into-array
;;                     (for [edge (.. this -props -viewer -spots -edges)]
;;                       (js/React.createElement Spot #js{:key (.. edge -node -id)
;;                                                        :spot (.. edge -node)}))))))}))))

;; (def queries
;;   #js {:name "App Queries"
;;        :params #js {}
;;        :queries #js {:viewer #(ql "query { viewer }")}})

;; (js/ReactDOM.render
;;  (js/React.createElement js/Relay.RootContainer #js {:Component SpotPage :route queries})
;;  (.getElementById js/document "app"))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
  )
