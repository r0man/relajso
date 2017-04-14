(ns pokedex.core
  (:require [pokedex.history :refer [history]]
            [pokedex.routes]
            [relajso.core :as r]))

(enable-console-print!)

(.setEnabled history true)

(defn on-js-reload [_]
  (.setEnabled history false)
  (.setEnabled history true)
  (println "Reloaded!"))
