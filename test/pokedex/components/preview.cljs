(ns pokedex.components.preview
  (:require [pokedex.history :refer [history]]
            [relajso.core :as r]
            [sablono.core :refer-macros [html]]))

(r/defui Pokemon
  static IFragments
  (fragments [this]
    {:pokemon #(r/ql "fragment on Pokemon { id name url }")})
  Object
  (render [this]
    (let [path (str "#/view/" (r/get this :props :pokemon :id))]
      (html
       [:div.preview-page
        {:on-click #(.setToken history path)}
        (when-let [src (r/get this :props :pokemon :url)]
          [:img.preview-img
           {:alt "Pokemon Image"
            :src src}])
        [:div.preview-name
         (r/get this :props :pokemon :name)]]))))
