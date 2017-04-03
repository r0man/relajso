(ns pokedex.core
  (:require [pokedex.history :refer [history]]
            [pokedex.routes]
            [relajso.core :as r]))

(enable-console-print!)

(defonce network
  (r/setup-network "https://api.graph.cool/relay/v1/cj0xkx3zbzxk401189kz2gqcj"))

(.setEnabled history true)
