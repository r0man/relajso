(ns relajso.test
  (:require [clojure.walk :refer [prewalk]])
  (:import cljs.tagged_literals.JSValue))

(defmethod print-method JSValue
  [^JSValue v, ^java.io.Writer w]
  (.write w "#js ")
  (.write w (pr-str (.val v))))

(defn js-value? [x]
  (instance? JSValue x))

(defn js->clj [form]
  (prewalk
   (fn [form]
     (if (js-value? form)
       (js->clj (.val form)) form))
   form))
