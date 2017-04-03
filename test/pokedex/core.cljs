(ns pokedex.core
  (:require [relajso.core :as r]
            [pokedex.history :refer [history]]
            [pokedex.components.preview :as preview]
            [pokedex.views.list :as list]
            [pokedex.views.pokemon :as pokemon]
            [sablono.core :refer-macros [html]]
            [secretary.core :as secretary :refer-macros [defroute]]
            [goog.object :as obj]
            [goog.events :as events]
            [goog.history.EventType :as EventType]))

(enable-console-print!)

(defonce application
  (.getElementById js/document "app"))

(defonce network
  (r/setup-network "https://api.graph.cool/relay/v1/cj0xkx3zbzxk401189kz2gqcj"))

(defn change-route [component route]
  (js/ReactDOM.render
   (js/React.createElement js/Relay.RootContainer #js {:Component component :route route})
   application))

(secretary/set-config! :prefix "#")

(defroute list-page-path "/" []
  (->> #js {:name "List Page Route"
            :params #js {}
            :queries #js {:viewer #(r/ql "query { viewer }")}}
       (change-route list/Page)))

(defroute pokemon-page-path "/view/:id" [id]
  (->> #js {:name "Pokemon Page Route"
            :params #js {:id id}
            :queries #js {:viewer #(r/ql "query { viewer }")}}
       (change-route pokemon/Page)))

(defroute "*" []
  (prn "<h1>LOL! YOU LOST!</h1>"))

(.setEnabled history true)
