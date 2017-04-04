(ns pokedex.components.card
  (:require [pokedex.history :refer [history]]
            [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(def root-style
  {:background-color "white"
   :border-radius "3px"
   :box-shadow "0 1px 11px 0 rgba(0, 0, 0, 0.2)"
   :display "flex"
   :flex-direction "column"
   :justify-content "space-between"
   :padding "20px"})

(def header-style
  {:background-color "#EFEFEF"
   :flex "0 0 auto"
   :padding "12px"})

(def title-style
  {:color "rgba(0,0,0,0.35)"
   :font-size "12px"
   :font-weight "400"
   :margin-bottom "2px"})

(def input-style
  {:font-family "'Open Sans', sans-serif"})

(def image-container-style
  {:display "flex"
   :flex-direction "column"
   :margin-top "20px"})

(def card-image-wrapper-style
  {:background-color "#F7F7F7"
   :flex "1 0 auto"
   :min-height "150px"
   :padding "40px"
   :position "relative"
   :text-align "center"})

(def card-image-style
  {:max-height "100%"
   :max-width "100%"
   :width "100%"})

(r/defui Card
  static r/IFragments
  (fragments [this]
    {})
  Object
  (render [this]
    (html
     [:div {:style root-style}
      [:div {:style header-style}
       [:div {:style title-style} "NAME"]
       [:input
        {:style input-style
         :placeholder "Type a name..."
         :value (r/get this :props :value)
         :on-change #(prn "TODO on-change")}]]

      [:div {:style image-container-style}

       [:div {:style header-style}
        [:div {:style title-style} "IMAGE URL"]
        [:input
         {;; :style input-style
          :placeholder "A link to Pokemons's image"
          :value (r/get this :props :url)
          :on-change #(prn "TODO on-change")}]]

       [:div {:style card-image-wrapper-style}
        [:img
         {:style card-image-style
          :src (r/get this :props :url)}]]]])))
