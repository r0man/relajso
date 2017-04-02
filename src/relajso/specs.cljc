(ns relajso.specs
  (:require [clojure.spec :as s]))

;; defui

(s/def ::defui-method-impl
  (s/cat :name symbol?
         :args vector?
         :body (s/* any?)))

(s/def ::defui-method
  (s/and list? ::defui-method-impl))

(s/def ::defui-static-methods
  (s/cat :static #(= 'static %)
         :protocol symbol?
         :methods (s/+ ::defui-method)))

(s/def ::defui-protocol-methods
  (s/cat :protocol symbol?
         :methods (s/+ ::defui-method)))

(s/def ::defui-methods
  (s/alt :static ::defui-static-methods
         :protocol ::defui-protocol-methods))

(s/def ::defui
  (s/cat :defui #(= 'defui %)
         :name symbol?
         :doc (s/? string?)
         :methods (s/* ::defui-methods)))
