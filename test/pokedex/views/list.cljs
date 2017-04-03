(ns pokedex.views.list
  (:require [pokedex.components.preview :as preview]
            [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(r/defui Page
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
