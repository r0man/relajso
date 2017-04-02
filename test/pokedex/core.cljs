(ns pokedex.core
  (:require [rum.core :as rum]
            [relajso.core :refer [oget defui ql]]
            [goog.object :as obj]
            [sablono.core :refer-macros [html]]
            [cljsjs.react-relay]))

(enable-console-print!)

(defonce network-injection
  (do (js/Relay.injectNetworkLayer
       (js/Relay.DefaultNetworkLayer. "https://api.graph.cool/relay/v1/cj0xkx3zbzxk401189kz2gqcj"))
      :init))

(defui PokemonPreview
  static IFragments
  (fragments [this]
    {:pokemon #(ql "fragment on Pokemon { id name url }")})
  Object
  (render [this]
    (html
     [:div.preview-page
      (when-let [src (oget this :props :pokemon :url)]
        [:img.preview-img
         {:alt "Pokemon Image"
          :src src}])
      [:div.preview-name
       (oget this :props :pokemon :name)]])))

(defui ListPage
  static IFragments
  (fragments [this]
    {:viewer #(ql "fragment on Viewer {
                     allPokemons (first: 1000) {
                       edges {
                         node {
                           ${pokedex.core.PokemonPreview.getFragment(\"pokemon\")}
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
            (count (oget this :props :viewer :allPokemons :edges))
            " Pokemons in your pokedex")]
      [:div.list-page-container
       (for [edge (oget this :props :viewer :allPokemons :edges)]
         (->> #js{:key (oget edge :node :id)
                  :pokemon (oget edge :node)}
              (js/React.createElement PokemonPreview)))]])))

(def viewer-queries
  #js {:name "App Queries"
       :params #js {}
       :queries #js {:viewer #(ql "query { viewer }")}})

(js/ReactDOM.render
 (js/React.createElement js/Relay.RootContainer #js {:Component ListPage :route viewer-queries})
 (.getElementById js/document "app"))

(defn on-js-reload []
  )
