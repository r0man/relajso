(ns pokedex.routes
  (:require [pokedex.views.list :as list]
            [pokedex.views.pokemon :as pokemon]
            [relajso.core :as r]
            [secretary.core :as secretary :refer [defroute]]))

(secretary/set-config! :prefix "#")

(def application
  (.getElementById js/document "app"))

(defn change-route [component route]
  (js/ReactDOM.render
   (js/React.createElement js/Relay.RootContainer #js {:Component component :route route})
   application))

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
