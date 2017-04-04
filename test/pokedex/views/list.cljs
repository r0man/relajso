(ns pokedex.views.list
  (:require [pokedex.components.preview :as preview]
            [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(def root-style
  {:background-color "#F2F2F2"
   :min-height "100vh"})

(def title-style
  {:color "#7F7F7F"
   :font-size "32px"
   :font-weight "300"
   :padding-bottom "50px"
   :padding-top "120px"
   :text-align "center"})

(def container-style
  {:align-items "stretch"
   :display "flex"
   :flex-wrap "wrap"
   :justify-content "center"
   :margin-left "130px"
   :margin-right "130px"})

(r/defui Page
  static r/IFragments
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
     [:div {:style root-style}
      [:div {:style title-style}
       (str "There are "
            (count (r/get this :props :viewer :allPokemons :edges))
            " Pokemons in your pokedex")]
      [:div {:style container-style}
       (for [edge (r/get this :props :viewer :allPokemons :edges)]
         (->> #js{:key (r/get edge :node :id)
                  :pokemon (r/get edge :node)}
              (js/React.createElement preview/Pokemon)))]])))
