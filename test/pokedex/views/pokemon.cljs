(ns pokedex.views.pokemon
  (:require [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(r/defui Page
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
