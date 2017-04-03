(ns pokedex.views.pokemon
  (:require [pokedex.components.card :as card]
            [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(def root-style
  {:align-items "center"
   :background-color "#F1F1F1"
   :display "flex"
   :height "100vh"
   :justify-content "center"
   :width "100vw"})

(def content-style
  {:width "350px"
   :display "flex"
   :flex-direction "column"})

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
     [:div {:style root-style}
      [:div {:style content-style}
       ;; TODO: Populate state
       (->> #js {:name (r/get this :state :name)
                 :url (r/get this :state :url)}
            (js/React.createElement card/Card))]])))
