(ns pokedex.schema
  (:require [relajso.core :as r]
            [clojure.java.io :as io]))

(def cache (atom {}))

(def compiler
  "The path to the relajso compiler."
  ;; TODO: Find a reliable way to get at the compiler. NPM package?
  (str (io/file ".." ".." "target" "relajso-compiler.js")))

(def schema
  "The path to the Pokedex schema."
  (str (io/file "resources" "pokedex.graphql")))

(defmacro graphql
  "Compile GraphQL documents using the Pokedex schema."
  [text]
  (r/compile-document compiler schema cache {:text text}))

(comment
  (graphql "fragment Pokemon on Pokemon { id name url }"))
