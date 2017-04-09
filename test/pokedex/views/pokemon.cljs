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

(def action-button-container-style
  {:display "flex"
   :flex-direction "row"
   :justify-content "space-between"})

(def delete-icon-url
  "http://demo.learnrelay.org/1b90b8ddb503641e94661b0a016a75e8.svg")

(def delete-icon-style
  {:height "18px"
   :padding "10px"
   :cursor "hand"
   :cursor "pointer"})

(def button-container-style
  {:align-items "center"
   :display "flex"
   :flex "0 0 auto"
   :flex-direction "row"
   :justify-content "space-between"
   :margin "25px 0"})

(def content-style
  {:width "350px"
   :display "flex"
   :flex-direction "column"})

(defn add-new? [this]
  (r/get this :props :params :id))

(defn add-pokemon! [this]
  (prn "TODO: add pokemon"))

(defn update-pokemon! [this]
  (prn "TODO: update pokemon"))

(defn delete-pokemon! [this]
  (prn "TODO: delete pokemon"))

(r/defui Page
  static r/IFragments
  (fragments [this]
    {:viewer
     #(r/ql "fragment on Viewer {
               id
               Pokemon(id: $id) @include( if: $pokemonExists ) {
                 id
                 name
                 url } }")})
  static r/IInitialVariables
  (initial-variables [this]
    {:id nil :pokemonExists false})

  static r/IPrepareVariables
  (prepare-variables [this {:keys [id] :as prev-vars}]
    (assoc prev-vars :pokemonExists (some? id)))

  Object
  (initLocalState [this]
    #js {:name (r/get this :props :viewer :Pokemon :name)
         :url (r/get this :props :viewer :Pokemon :url)})
  (render [this]
    (html
     [:div {:style root-style}
      [:div {:style content-style}
       (->> #js {:name (r/get this :state :name)
                 :url (r/get this :state :url)}
            (js/React.createElement card/Card))
       [:div {:style button-container-style}
        [:div
         (when-not (add-new? this)
           [:img
            {:class delete-icon-style
             :src delete-icon-url}])]
        [:div {:style action-button-container}]]]])))
