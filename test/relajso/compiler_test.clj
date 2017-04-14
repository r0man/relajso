(ns relajso.compiler-test
  (:require [clojure.test :refer :all]
            [relajso.compiler :refer :all]
            [relajso.test :refer :all]))

(defmacro graphql [text]
  (compile-document
   "target/relajso-compiler.js"
   "test-resources/pokedex.graphql"
   (atom {})
   {:text text}))

(deftest test-compile-document
  (are [text expected] (= (js->clj (graphql text)) expected)
    "fragment Pokemon on Pokemon { id name url }"
    {:argumentDefinitions []
     :kind "Fragment"
     :metadata nil
     :name "Pokemon"
     :selections
     [{:kind "ScalarField"
       :alias nil
       :args nil
       :name "id"
       :selections nil
       :storageKey nil}
      {:kind "ScalarField"
       :alias nil
       :args nil
       :name "name"
       :selections nil
       :storageKey nil}
      {:kind "ScalarField"
       :alias nil
       :args nil
       :name "url"
       :selections nil
       :storageKey nil}]
     :type "Pokemon"}

    "mutation CreatePokemon($input: CreatePokemonInput!) {
       createPokemon(input: $input) {
          viewer {
            id
          }
       }
     }"
    {:fragment
     {:argumentDefinitions
      [{:kind "LocalArgument",
        :name "input",
        :type "CreatePokemonInput!",
        :defaultValue nil}],
      :kind "Fragment",
      :metadata nil,
      :name "CreatePokemon",
      :selections
      [{:kind "LinkedField",
        :alias nil,
        :args
        [{:kind "Variable",
          :name "input",
          :variableName "input",
          :type "CreatePokemonInput!"}],
        :concreteType "CreatePokemonPayload",
        :name "createPokemon",
        :plural false,
        :selections
        [{:kind "LinkedField",
          :alias "viewer",
          :args nil,
          :concreteType "Viewer",
          :name "__viewer_viewer",
          :plural false,
          :selections
          [{:kind "ScalarField",
            :alias nil,
            :args nil,
            :name "id",
            :selections nil,
            :storageKey nil}],
          :storageKey nil}],
        :storageKey nil}],
      :type "Mutation"},
     :id nil,
     :kind "Batch",
     :metadata {},
     :name "CreatePokemon",
     :query
     {:argumentDefinitions
      [{:kind "LocalArgument",
        :name "input",
        :type "CreatePokemonInput!",
        :defaultValue nil}],
      :kind "Root",
      :name "CreatePokemon",
      :operation "mutation",
      :selections
      [{:kind "LinkedField",
        :alias nil,
        :args
        [{:kind "Variable",
          :name "input",
          :variableName "input",
          :type "CreatePokemonInput!"}],
        :concreteType "CreatePokemonPayload",
        :name "createPokemon",
        :plural false,
        :selections
        [{:kind "LinkedField",
          :alias nil,
          :args nil,
          :concreteType "Viewer",
          :name "viewer",
          :plural false,
          :selections
          [{:kind "ScalarField",
            :alias nil,
            :args nil,
            :name "id",
            :selections nil,
            :storageKey nil}],
          :storageKey nil}
         {:kind "LinkedHandle",
          :alias nil,
          :args nil,
          :handle "viewer",
          :name "viewer",
          :key "",
          :filters nil}],
        :storageKey nil}]},
     :text (str "mutation CreatePokemon(\n  $input: CreatePokemonInput!\n) "
                "{\n  createPokemon(input: $input) {\n    viewer {\n"
                "      id\n    }\n  }\n}\n")}))

(deftest test-parse-document
  (are [text expected] (= (parse-document {:text text}) expected)
    nil nil
    "" nil

    "fragment Pokemon on Pokemon { id name url }"
    {:name "Pokemon"
     :text "fragment Pokemon on Pokemon { id name url }"
     :type :fragment}

    "mutation createPokemon($input: CreatePokemonInput!)"
    {:name "createPokemon"
     :text "mutation createPokemon($input: CreatePokemonInput!)"
     :type :mutation}

    "query ListPage { }"
    {:name "ListPage"
     :text "query ListPage { }"
     :type :query}

    "query PokemonPage($id: ID) { }"
    {:name "PokemonPage"
     :text "query PokemonPage($id: ID) { }"
     :type :query}

    "query PokemonPage ($id: ID) { }"
    {:name "PokemonPage"
     :text "query PokemonPage ($id: ID) { }"
     :type :query}))
