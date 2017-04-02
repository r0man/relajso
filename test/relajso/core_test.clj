(ns relajso.core-test
  (:require [relajso.core :refer :all]
            [clojure.test :refer :all]))

(deftest test-parse-ui-protocols
  (is (= (parse-ui
          '(defui MySpot
             Object
             (componentDidMount [this]
               (.log js/console "did mount"))
             (render [this]
               "Hello world")))
         '{:defui defui,
           :name MySpot,
           :methods
           [[:protocol
             {:protocol Object,
              :methods
              [{:name componentDidMount,
                :args [this],
                :body [(.log js/console "did mount")]}
               {:name render, :args [this], :body ["Hello world"]}]}]]})))

(deftest test-parse-ui-statics
  (is (= (parse-ui
          '(defui MySpot
             static relajso/IFragments
             (fragments [this]
               {:spot "fragment on Spot { name }"})
             static relajso/IInitVars
             (init-vars [this]
               {:size 50})))
         '{:defui defui,
           :name MySpot,
           :methods
           [[:static
             {:static static,
              :protocol relajso/IFragments,
              :methods
              [{:name fragments,
                :args [this],
                :body [{:spot "fragment on Spot { name }"}]}]}]
            [:static
             {:static static,
              :protocol relajso/IInitVars,
              :methods
              [{:name init-vars, :args [this], :body [{:size 50}]}]}]]})))
