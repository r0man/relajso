(ns relajso.reader
  (:require [cljs.nodejs :as node]
            [cljs.tools.reader.reader-types :refer [Reader PushbackReader]]))

(def fs
  (node/require "fs"))

(defn slurp [path]
  (.readFileSync fs path))

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
