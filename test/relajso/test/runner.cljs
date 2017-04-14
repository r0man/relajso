(ns relajso.test.runner
  (:require [doo.runner :refer-macros [doo-tests]]
            [relajso.compiler-test]))

(doo-tests 'relajso.compiler-test)
