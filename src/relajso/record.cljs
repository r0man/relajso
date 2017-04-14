(ns relajso.record
  (:refer-clojure :exclude [clone merge update])
  (:require [cljs.core :as core]))

(defn clone
  "Clone a record."
  [record]
  (println "record clone:" record)
  record)

(defn copy-fields
  "Copies all fields from `source` to `sink`."
  [source sink]
  (println "record copy-fields:" source sink)
  (core/merge sink source))

(defn create
  "Create a new record."
  [data-id type-name]
  (println "record create:" data-id type-name)
  (with-meta {}
    {::data-id data-id
     ::type-name type-name}))

(defn get-data-id
  "Get the record's `id` if available or the client-generated
  identifier."
  [record]
  (println "record get-data-id:" record)
  (-> record meta ::data-id))

(defn get-type
  "Get the concrete type of the record."
  [record]
  (println "record get-type:" record)
  (-> record meta ::type-name))

(defn get-value
  "Get a scalar (non-link) field value."
  [record storage-key]
  (println "record get-value:" record storage-key)
  (get record (keyword storage-key)))

(defn get-linked-record-id
  "Get the value of a field as a reference to another record. Throws
  if the field has a different type."
  [record storage-key]
  (println "record get-linked-record-id:" record storage-key)
  (get (:link (meta record)) (keyword storage-key)))

(defn get-linked-record-ids
  "Get the value of a field as a list of references to other
  records. Throws if the field has a different type."
  [record storage-key]
  (println "record get-linked-record-ids:" record storage-key)
  (get (:links (meta record)) (keyword storage-key)))

(defn update
  "Compares the fields of a previous and new record, returning either
  the previous record if all fields are equal or a new record (with
  merged fields) if any fields have changed."
  [prev-record next-record]
  (println "record update:" prev-record next-record)
  (if (= prev-record next-record)
    prev-record
    (core/merge prev-record next-record)))

(defn merge
  "Returns a new record with the contents of the given records. Fields
  in the second record will overwrite identical fields in the first
  record."
  [record-1 record-2]
  (println "record merge:" record-1 record-2)
  (core/merge record-1 record-2))

(defn freeze
  "Prevent modifications to the record. Attempts to call `set*`
  functions on a frozen record will fatal at runtime."
  [record]
  (println "record freeze:" record)
  record)

(defn set-value
  "Set the value of a storageKey to a scalar."
  [record storage-key value]
  (println "record set-value:" record)
  (assoc record storage-key value))

(defn set-linked-record-id
  "Set the value of a field to a reference to another record."
  [record storage-key linked-id]
  (println "record set-linked-record-id:" record storage-key linked-id)
  (vary-meta record assoc :link storage-key linked-id))

(defn set-linked-record-ids
  "Set the value of a field to a reference to another record."
  [record storage-key linked-ids]
  (println "record set-linked-record-ids:" record storage-key linked-ids)
  (vary-meta record assoc :links storage-key linked-ids))

(def module-exports
  #js {:clone clone
       :copyFields copy-fields
       :create create
       :freeze freeze
       :getDataID get-data-id
       :getLinkedRecordID get-linked-record-id
       :getLinkedRecordIDs get-linked-record-ids
       :getType get-type
       :getValue get-value
       :merge merge
       :setValue set-value
       :setLinkedRecordID set-linked-record-id
       :setLinkedRecordIDs set-linked-record-ids
       :update update})
