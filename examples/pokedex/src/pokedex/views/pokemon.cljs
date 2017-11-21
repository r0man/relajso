(ns pokedex.views.pokemon
  (:require-macros [pokedex.schema :refer [graphql]])
  (:require [pokedex.components.card :as card]
            [pokedex.history :as history]
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

(def button-style
  {:cursor "pointer"
   :flex "0 0 auto"
   :font-size "18px"
   :font-weight "300"
   :height "18px"
   :line-height "1"
   :padding "15px 30px"})

(def cancel-button-style
  (merge button-style
         {:color "#A3A3A3"}))

(def save-button-style
  (merge button-style
         {:border-radius "3px"
          :color "white"
          :background-color "#2BC3A1"}))

(def create-mutation
  (graphql
   "mutation CreatePokemon($input: CreatePokemonInput!) {
      createPokemon(input: $input) {
         clientMutationId
         viewer {
           id
         }
         pokemon {
           id name url
         }
      }
    }"))

(def update-mutation
  (graphql
   "mutation UpdatePokemon($input: UpdatePokemonInput!) {
      updatePokemon(input: $input) {
         clientMutationId
         viewer {
           id
         }
         pokemon {
           id name url
         }
      }
    }"))

(def delete-mutation
  (graphql
   "mutation DeletePokemon($input: DeletePokemonInput!) {
      deletePokemon(input: $input) {
         clientMutationId
         deletedId
         viewer {
           id
         }
      }
    }"))

(defn- add-new? [this]
  (not (r/get this :state :id)))

(defn- error [msg ex]
  (.log js/console ex)
  (js/alert msg))

(defn- create-pokemon! [this]
  (r/mutate this create-mutation
            {:input
             {:clientMutationId (str (random-uuid))
              :name (r/get this :state :name)
              :url (r/get this :state :url)}}
            {:on-completed #(history/go-to "/")
             :on-error #(error "Can't create pokemon." %)}))

(defn- update-pokemon! [this]
  (r/mutate this update-mutation
            {:input
             {:clientMutationId (str (random-uuid))
              :id (r/get this :state :id)
              :name (r/get this :state :name)
              :url (r/get this :state :url)}}
            {:on-completed #(history/go-to "/")
             :on-error #(error "Can't update pokemon." %)}))


(defn- delete-pokemon! [this]
  (r/mutate this delete-mutation
            {:input
             {:clientMutationId (str (random-uuid))
              :id (r/get this :state :id)}}
            {:on-completed #(history/go-to "/")
             :on-error #(error "Can't delete pokemon." %)}))

(r/defui Page
  static r/IQueryRenderer
  (query [_]
    (graphql
     "query PokemonPage ($id: ID) {
        viewer {
          id
          Pokemon(id: $id) {
            id
            name
            url } } }"))

  Object
  (componentWillReceiveProps [this props]
    (.setState this (r/get props :props :viewer :Pokemon)))

  (render [this]
    (when-let [props (r/get this :props :props)]
      (html
       [:div {:style root-style}
        [:div {:style content-style}
         (let [pokemon (r/get this :state)]
           (card/card
            #js {:id (r/get pokemon :id)
                 :name (r/get pokemon :name)
                 :url (r/get pokemon :url)
                 :on-name-change #(.setState this #js {:name %})
                 :on-url-change #(.setState this #js {:url %})}))
         [:div {:style button-container-style}
          [:div
           (when-not (add-new? this)
             [:img {:on-click #(delete-pokemon! this)
                    :src delete-icon-url
                    :style delete-icon-style}])]
          [:div {:style action-button-container-style}
           [:div
            {:style cancel-button-style
             :on-click #(history/go-to "/")}
            "Cancel"]
           [:div
            {:on-click
             (if (add-new? this)
               #(create-pokemon! this)
               #(update-pokemon! this))
             :style save-button-style}
            (if (add-new? this)
              "Add" "Save")]]]]]))))
