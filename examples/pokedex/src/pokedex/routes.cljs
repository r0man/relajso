(ns pokedex.routes
  (:require-macros [pokedex.schema :refer [graphql]])
  (:require [pokedex.views.list :as list]
            [pokedex.views.pokemon :as pokemon]
            [sablono.core :refer [defhtml html]]
            [relajso.core :as r]
            [secretary.core :as secretary :refer [defroute]]))

(secretary/set-config! :prefix "#")

(defonce network
  (r/network "https://api.graph.cool/relay/v1/cj0xkx3zbzxk401189kz2gqcj"))

(defonce env
  (r/env {:network network}))

(defn change-route [render & [props]]
  (js/ReactDOM.render
   (render (assoc props :env env))
   (.getElementById js/document "app")))

(defroute list-page "/" []
  (change-route list/page))

(defroute pokemon-page "/view/:id" [id]
  ;; TODO: Convert #js ?
  (change-route pokemon/page {:vars #js {:id id}}))

(defroute create-page "/create" [id]
  ;; TODO: Convert #js ?
  (change-route pokemon/page {:vars #js {}}))
