(ns relajso.core
  (:refer-clojure :exclude [get])
  (:require [cljsjs.react-relay]
            [goog.object :as obj]))

(enable-console-print!)

(defprotocol IFragments
  (fragments [this]
    "Return the component's data requirements using fragments."))

(defprotocol IInitialVariables
  (initial-variables [this]
    "Return the initial set of variable values available to this
    component's fragments."))

(defprotocol IPrepareVariables
  (prepare-variables [this prev-vars]
    "A method to modify the variables based on the runtime environment
    or previous variable values."))

(defn get [obj & ks]
  (apply obj/getValueByKeys obj (map name ks)))

(defn setup-network
  "Inject the Relay network layer for `url`."
  [url]
  (->> (js/Relay.DefaultNetworkLayer. url)
       (js/Relay.injectNetworkLayer))
  url)
