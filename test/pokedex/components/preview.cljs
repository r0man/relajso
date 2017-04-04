(ns pokedex.components.preview
  (:require [pokedex.history :refer [history]]
            [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(def root-style
  {:backface-visibility "hidden"
   :background-color "white"
   :border-radius "3px"
   :box-shadow "0 2px 8px 0 rgba(0,0,0,0.25)"
   :box-sizing "border-box"
   :cursor "pointer"
   :display "flex"
   :flex-direction "column"
   :justify-content "space-between"
   :padding "20px"
   :transition "transform .2s ease, box-shadow .2s ease"
   :width "180px"})

(def image-style
  {:box-sizing "border-box"
   :display "block"
   :height "auto"
   :width "100%"})

(def name-style
  {:color "#7F7F7F"
   :font-size "24px"
   :font-weight "300"
   :padding "20px 0 0"
   :text-align "center"
   :user-select "none"})

(r/defui Pokemon
  static r/IFragments
  (fragments [this]
    {:pokemon #(r/ql "fragment on Pokemon { id name url }")})
  Object
  (render [this]
    (let [path (str "#/view/" (r/get this :props :pokemon :id))]
      (html
       [:div.preview-root
        {:on-click #(.setToken history path)
         :style root-style}
        (when-let [src (r/get this :props :pokemon :url)]
          [:img {:alt "Pokemon Image"
                 :src src
                 :style image-style}])
        [:div {:style name-style}
         (r/get this :props :pokemon :name)]]))))
