(ns pokedex.core
  (:require [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(enable-console-print!)

(defonce network
  (r/setup-network "https://api.graph.cool/relay/v1/cj0xkx3zbzxk401189kz2gqcj"))

(r/defui PokemonPreview
  static IFragments
  (fragments [this]
    {:pokemon #(r/ql "fragment on Pokemon { id name url }")})
  Object
  (render [this]
    (html
     [:div.preview-page
      (when-let [src (r/get this :props :pokemon :url)]
        [:img.preview-img
         {:alt "Pokemon Image"
          :src src}])
      [:div.preview-name
       (r/get this :props :pokemon :name)]])))

(r/defui ListPage
  static IFragments
  (fragments [this]
    {:viewer
     #(r/ql "fragment on Viewer {
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
            (count (r/get this :props :viewer :allPokemons :edges))
            " Pokemons in your pokedex")]
      [:div.list-page-container
       (for [edge (r/get this :props :viewer :allPokemons :edges)]
         (->> #js{:key (r/get edge :node :id)
                  :pokemon (r/get edge :node)}
              (js/React.createElement PokemonPreview)))]])))

(def viewer-queries
  #js {:name "App Queries"
       :params #js {}
       :queries #js {:viewer #(r/ql "query { viewer }")}})

(js/ReactDOM.render
 (js/React.createElement js/Relay.RootContainer #js {:Component ListPage :route viewer-queries})
 (.getElementById js/document "app"))

(defn on-js-reload []
  (prn "Reloaded!"))
