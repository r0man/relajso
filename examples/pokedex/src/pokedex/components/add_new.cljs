(ns pokedex.components.add-new
  (:require [pokedex.history :as history]
            [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(def root-style
  {:background-color "transparent"
   :border "dashed #d4d4d4"
   :border-radius "3px"
   :box-sizing "border-box"
   :color "#d4d4d4"
   :cursor "pointer"
   :display "flex"
   :flex-direction "column"
   :justify-content "center"
   :transition "border-color .2s ease, color .2s ease"
   ;; :transition "transform 0.2s"
   :width "180px"})

(def link-style
  {:display "flex"
   :min-height "250px"
   :padding "10px"
   :text-decoration "none"})

(def plus-style
  {:text-align "center"
   :font-size "70px"
   :line-height "1"
   :font-weight "300"})

(def title-style
  {:margin-top "14px"
   :text-align "center"
   :font-size "24px"
   :user-select "none"
   :font-weight "300"})

(r/defcomponent AddNew
  Object
  (render [this]
    (html
     [:div
      {:on-click #(history/go-to "/create")
       :style link-style}
      [:div {:style root-style}
       [:div {:style plus-style} "+"]
       [:div {:style title-style} "Add New"]]])))
