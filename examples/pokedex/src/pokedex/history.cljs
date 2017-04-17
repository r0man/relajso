(ns pokedex.history
  (:require [goog.events :as events]
            [goog.history.EventType :as EventType]
            [secretary.core :as secretary])
  (:import goog.History))

(defonce history
  (let [history (History.)]
    (goog.events/listen history EventType/NAVIGATE #(secretary/dispatch! (.-token %)))
    history))

(defn go-to [path]
  (.setToken history path))
