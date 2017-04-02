(ns relajso.core
  (:require [goog.object :as obj]))

(enable-console-print!)

(defprotocol IFragments
  (fragments [this] "Return the component's data requirements using
  fragments."))

(defprotocol IInitVars
  (init-vars [this] "Return the initial set of variable values
  available to this component's fragments."))

(defprotocol IPrepareVars
  (prepare-vars [this] "A method to modify the variables based on the
  runtime environment or previous variable values."))

(defn inject-network-layer
  "Inject the Relay network layer."
  []
  (js/Relay.injectNetworkLayer
   (js/Relay.DefaultNetworkLayer. "http://localhost:7000/graphql")))

(defn oget [obj & ks]
  (apply obj/getValueByKeys obj (map name ks)))
