(ns relajso.analyzer
  (:require-macros [cljs.env.macros :refer [ensure]]
                   [cljs.analyzer.macros
                    :refer [no-warn wrapping-errors
                            disallowing-recur allowing-redef disallowing-ns*]])
  (:require [cljs.analyzer :as ana]
            [cljs.tools.reader :as reader]
            [cljs.analyzer.api :as ana-api]
            [cljs.env :as env]
            [cljs.js :as cljs]
            [cljs.pprint :refer [pprint]]
            [cljs.nodejs :as node]
            [cljs.tools.reader.reader-types :as readers]
            [cljs.tagged-literals :as tags]
            [clojure.string :as string]))

(def fs
  (node/require "fs"))

(defn analyze [cljs-code]
  (let [empty-compiler-env (ana-api/empty-state)
        empty-analyzer-env (ana-api/empty-env)]
    (ana/analyze empty-analyzer-env cljs-code)))

(defn ext
  "Given a file, url or string return the file extension."
  [x]
  {:pre [(string? x)]}
  (last (string/split x #"\.")))

(defn slurp [path]
  (.readFileSync fs path))

(defn forms-seq*
  "Seq of Clojure/ClojureScript forms from rdr, a java.io.Reader. Optionally
     accepts a filename argument which will be used in any emitted errors."
  [filename]
  ;; {:pre [(instance? Reader rdr)]}
  (let [eof-sentinel #js {}
        opts (merge
              {:eof eof-sentinel}
              (if (and filename (= (ext filename) "cljc"))
                {:read-cond :allow :features #{:cljs}}))
        pbr (readers/indexing-push-back-reader
             (readers/string-push-back-reader (slurp filename))
             1 filename)
        data-readers tags/*cljs-data-readers*
        forms-seq_
        (fn forms-seq_ []
          (lazy-seq
           (let [form (binding [;; *ns* (create-ns *cljs-ns*)
                                reader/*data-readers* data-readers
                                ;; reader/*alias-map*
                                ;; (apply merge
                                ;;        ((juxt :requires :require-macros)
                                ;;         (get-namespace *cljs-ns*)))
                                ;; reader/resolve-symbol resolve-symbol
                                ]
                        (reader/read opts pbr))]
             (when-not (identical? form eof-sentinel)
               (cons form (forms-seq_))))))]
    (forms-seq_)))

;; (pprint (analyze '(+ 1 2)))
;; (prn (forms-seq* "hello.cljs"))
