(ns relajso.compiler
  (:require [cljs.tagged-literals :refer [read-js]]
            [clojure.java.io :as io]
            [clojure.edn :as edn]
            [clojure.string :as str]
            [me.raynes.conch :as conch]))

(def document-regex
  #"(?sm)(fragment|mutation|query)\s*([^ \(]+).*")

(defn parse-document
  [{:keys [text] :as document}]
  (when-let [[_ type name] (re-matches document-regex (str text))]
    (assoc document :type (keyword type) :name name)))

(defn cached-documents
  "Returns all document for `schema` from `cache`."
  [cache schema]
  (vals (get @cache schema)))

(defn register-document!
  [cache schema document]
  (if-let [{:keys [name] :as document} (parse-document document)]
    (do (swap! cache assoc-in [schema name] document)
        document)
    (throw (ex-info "Invalid GraphQL document." document))))

(defn- compile-unit
  "Compile the GraphQL compilation unit of `schema`."
  [compiler schema cache]
  (->> {:in (pr-str (map #(dissoc % :ast) (cached-documents cache schema)))}
       (conch/execute "node" compiler schema)
       (edn/read-string {:readers {'js read-js}})
       (map #(register-document! cache schema %))
       (doall)))

(defn compile-document
  "Compile the GraphQL `query` using `schema`."
  [compiler schema cache document]
  (let [document (register-document! cache schema document)]
    ;; TODO: Cache the hell out of this.
    (try (compile-unit compiler schema cache)
         (:ast (get-in @cache [schema (:name document)]))
         (catch Exception e
           (throw (ex-info (str "Can't parse GraphQL document: " (.getMessage e)
                                "\n" (-> e ex-data :stderr))
                           (ex-data e)))))))
