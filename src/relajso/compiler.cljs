(ns relajso.compiler
  (:require-macros [cljs.core.async.macros :refer [go-loop]])
  (:require [cljs.core.async :as async]
            [cljs.tagged-literals :refer [read-js]]
            [cljs.tools.reader.edn :as edn]
            [cljs.tools.reader :as reader]
            [cljs.tools.reader.reader-types :refer [Reader PushbackReader]]
            [cljs.nodejs :as node]
            [cljs.pprint :refer [pprint]]
            [cljs.reader :refer [read-string]]
            [goog.object :as obj]))

(def ast-convert
  (node/require "relay-compiler/lib/ASTConvert"))

(def fs
  (node/require "fs"))

(def graphql
  (node/require "graphql"))

(def relay-runtime
  (node/require "relay-runtime"))

(def RelayCompiler
  (.-Compiler (node/require "relay-compiler")))

(def RelayCompilerContext
  (node/require "relay-compiler/lib/RelayCompilerContext"))

(def RelayIRTransforms
  (node/require "relay-compiler/lib/RelayIRTransforms"))

(def relay-schema-ext
  "The Relay extensions to the GraphQL spec."
  "directive @include(if: Boolean) on FRAGMENT | FIELD
   directive @skip(if: Boolean) on FRAGMENT | FIELD
   directive @relay(pattern: Boolean, plural: Boolean) on FRAGMENT | FIELD")

(defn parse-schema
  "Parse the GraphQL schema at `path`."
  [path]
  (.transformASTSchema
   ast-convert
   (->> (.readFileSync fs path)
        (str relay-schema-ext "\n")
        (.parse graphql)
        (.buildASTSchema graphql))
   (.-schemaTransforms RelayIRTransforms)))

(defn make-compiler
  "Returns a new Relay compiler for `schema`."
  [schema]
  (let [context (RelayCompilerContext. schema)]
    (RelayCompiler. schema context RelayIRTransforms)))

(defn parse-document [schema text]
  (let [ast (.parse graphql text)
        extended (.extendSchema graphql schema ast)]
    (.convertASTDocuments ast-convert extended #js [ast] #js [])))

(defn add-definitions [compiler text]
  (let [schema (.-schema (.context compiler))]
    (->> (parse-document schema text)
         (.addDefinitions compiler))))

(deftype NodeReadableReader [readable ^:mutable buf]
  Reader
  (read-char [reader]
    (if buf
      (let [c (aget buf 0)]
        (set! buf nil)
        (char c))
      (when-let [c (.read readable 1)]
        (char (str c)))))
  (peek-char [reader]
    (when-not buf
      (set! buf (str (.read readable 1))))
    (when buf
      (char (aget buf 0)))))

(defn node-readable-push-back-reader [readable]
  (PushbackReader. (NodeReadableReader. readable nil) (object-array 1) 1 1))

;; (defn read-input
;;   "Read input from stdin."
;;   []
;;   (let [channel (async/chan)
;;         stdin (.-stdin node/process)
;;         reader (node-readable-push-back-reader stdin)]
;;     (.setEncoding stdin "UTF8")
;;     (.on stdin "readable" #(try (when-let [obj (reader/read {:eof nil} reader)]
;;                                   (async/put! channel obj))
;;                                 (catch js/Error e
;;                                   (prn "ERROR"))))
;;     (.on stdin "end" #(async/close! channel))
;;     channel))

(defn read-input
  "Read input from stdin."
  []
  (let [channel (async/chan)
        stdin (.-stdin node/process)
        reader (node-readable-push-back-reader stdin)
        opts {:eof nil :readers {'js read-js}}]
    (.setEncoding stdin "UTF8")
    (.on stdin "readable" #(try (when-let [obj (edn/read opts reader)]
                                  (async/put! channel obj))
                                (catch js/Error e
                                  (prn "ERROR"))))
    (.on stdin "end" #(async/close! channel))
    channel))

;; (defn compile-input
;;   "Compile `input` using `schema` and return the compiled documents."
;;   [schema input]
;;   (let [compiler (make-compiler schema)
;;         definitions (mapcat #(add-definitions compiler (:text %)) input)
;;         documents (.compile compiler)]
;;     ;; (pprint (js->clj definitions))
;;     (pprint input)
;;     (map (fn [input definition]
;;            (prn (.-name definition))
;;            (assoc input :ast (.get documents (.-name definition))))
;;          input definitions)))

(defn compile-input
  "Compile `input` using `schema` and return the compiled documents."
  [schema input]
  (let [compiler (make-compiler schema)]
    (doseq [definitions input]
      (add-definitions compiler (:text definitions)))
    (let [documents (.compile compiler)]
      (map (fn [input]
             (assoc input :ast (.get documents (:name input))))
           input))))

(defn print-usage []
  (println "Usage: relajso-compiler MY-SCHEMA.graphql")
  (.exit node/process 1))

(defn -main [& args]
  (node/enable-util-print!)
  (if-let [path (first args)]
    (let [schema (parse-schema path)
          input (read-input)]
      (go-loop []
        (try (when-let [input (async/<! input)]
               (prn (compile-input schema input))
               (recur)))))
    (print-usage)))

(set! *main-cli-fn* -main)

(comment

  (def schema
    (parse-schema "test-resources/pokedex.graphql"))

  (def compiler
    (make-compiler schema))

  (def viewer-query
    "query ViewerQuery { viewer { id } }")

  (def pokemon-fragment
    "fragment PokemonFragment on Viewer {
       id
       Pokemon(id: $id) @include( if: $pokemonExists ) {
         id name url
       }
     }")

  (def list-query
    "fragment ListFragment on Viewer {
       allPokemons (first: 1000) {
         edges {
           node {
             ...PokemonFragment
             id
           }
         }
       }
       id
     }")

  (parse-document schema list-query)

  (prn (parse-document schema viewer-query))
  (.-name (first (parse-document schema viewer-query)))
  (.-name (first (parse-document schema pokemon-fragment)))
  (.-name (first (parse-document schema list-query)))

  (add-definitions compiler viewer-query)
  (add-definitions compiler pokemon-fragment)
  (add-definitions compiler list-query)

  (def results (.compile compiler))

  (prn (.get results "ViewerQuery"))
  (prn (.get results "ListFragment"))
  (pprint (js->clj (.get results "ListFragment")))

  (.forEach (.entries results) #(prn %))

  (js->clj (.values results))

  (.-size (.compile compiler))

  )
