(ns pokedex.core
  (:require [relajso.core :as r]
            [pokedex.history :refer [history]]
            [pokedex.components.preview :as preview]
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

(r/defui ListPage
  static IFragments
  (fragments [this]
    {:viewer
     #(r/ql "fragment on Viewer {
               allPokemons (first: 1000) {
                 edges {
                   node {
                     ${pokedex.components.preview.Pokemon.getFragment(\"pokemon\")}
                     id
                   }
                 }
               }
               id
             }")})
  Object
  (render [this]
    (html
     [:div.list-page-root
      [:div.list-page-title
       (str "There are "
            (count (r/get this :props :viewer :allPokemons :edges))
            " Pokemons in your pokedex")]
      [:div.list-page-container
       (for [edge (r/get this :props :viewer :allPokemons :edges)]
         (->> #js{:key (r/get edge :node :id)
                  :pokemon (r/get edge :node)}
              (js/React.createElement preview/Pokemon)))]])))

(r/defui PokemonPage
  static IFragments
  (fragments [this]
    {:viewer
     #(r/ql "fragment on Viewer {
               id
               Pokemon(id: $id) @include( if: $pokemonExists ) {
                 id
                 name
                 url } }")})
  static IInitialVariables
  (initial-variables [this]
    (prn "IInitialVariables")
    {:id nil :pokemonExists false})

  static IPrepareVariables
  (prepare-variables [this prev-vars]
    (prn "IPrepareVariables")
    (prn prev-vars)
    (update prev-vars :pokemonExists some?))

  Object
  (render [this]
    (html
     [:div.list-page-root
      "POKEMON"])))

(defn change-route [component route]
  (js/ReactDOM.render
   (js/React.createElement js/Relay.RootContainer #js {:Component component :route route})
   application))

(secretary/set-config! :prefix "#")

(defroute list-page-path "/" []
  (->> #js {:name "List Page Route"
            :params #js {}
            :queries #js {:viewer #(r/ql "query { viewer }")}}
       (change-route ListPage)))

(defroute pokemon-page-path "/view/:id" [id]
  (prn "POKEMON")
  (->> #js {:name "Pokemon Page Route"
            :params #js {:id id}
            :queries #js {:viewer #(r/ql "query { viewer }")}}
       (change-route PokemonPage)))

(defroute "*" []
  (prn "<h1>LOL! YOU LOST!</h1>"))

;; (change-route ListPage viewer-queries)

;; (defonce history
;;   (let [history (History.)]
;;     (goog.events/listen history EventType/NAVIGATE #(secretary/dispatch! (.-token %)))
;;     (.setEnabled history true)
;;     history))

;; (defn on-js-reload []
;;   (prn "Reloaded!"))

(.setEnabled history true)
