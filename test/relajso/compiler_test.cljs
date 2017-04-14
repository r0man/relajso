(ns relajso.compiler-test
  (:require [relajso.compiler :as comp]
            [clojure.test :refer [are is deftest]]))

(def pokedex-schema
  "test-resources/pokedex.graphql")

(def example-query
  "query Viewer { viewer { id } }")

(def example-mutation
  "mutation CreatePokemon($input: CreatePokemonInput!) {
     createPokemon(input: $input) {
        viewer {
          id
        }
     }
   }")

(def example-fragment
  "fragment Pokemon on Pokemon { id name url }")

(deftest test-parse-schema
  (is (comp/parse-schema pokedex-schema)))

(deftest test-parse-document-fragment
  (let [schema (comp/parse-schema pokedex-schema)
        [document] (comp/parse-document schema example-fragment)]
    (is (= (.-name document) "Pokemon"))))

(deftest test-parse-document-mutation
  (let [schema (comp/parse-schema pokedex-schema)
        [document] (comp/parse-document schema example-mutation)]
    (is (= (.-name document) "CreatePokemon"))))

(deftest test-parse-document-query
  (let [schema (comp/parse-schema pokedex-schema)
        [document] (comp/parse-document schema example-query)]
    (is (= (.-name document) "Viewer"))))
