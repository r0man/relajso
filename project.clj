(defproject relajso "0.1.0-SNAPSHOT"
  :description "FIXME: write this!"
  :url "https://github.com/r0man/relajso"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :min-lein-version "2.7.1"
  :dependencies [;; TODO: How to load react-relay properly?
                 ;; [cljsjs/react "15.5.0-0"]
                 ;; [cljsjs/react-dom "15.5.0-0"]
                 ;; [cljsjs/react-relay "1.0.0-alpha2-0"]
                 ;; [cljsjs/relay-runtime "1.0.0-alpha2-0"]
                 [inflections "0.13.0"]
                 [me.raynes/conch "0.8.0"]
                 [org.clojure/clojure "1.9.0-RC1"]
                 [org.clojure/clojurescript "1.9.946"]
                 [org.clojure/core.async "0.3.465"]
                 [tempfile "0.2.0"]]
  :plugins [[lein-cljsbuild "1.1.7" :exclusions [[org.clojure/clojure]]]
            [lein-doo "0.1.8"]]
  :profiles {:dev {:dependencies [[com.cemerick/piggieback "0.2.2"]
                                  [doo "0.1.8"]]
                   :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}
                   :resource-paths ["test-resources"]
                   :source-paths ["src" "dev"]}}
  :aliases {"ci" ["do"
                  ["clean"]
                  ["test" ":default"]
                  ["cljsbuild" "once" "compiler"]
                  ["doo" "node" "test" "once"]]}
  :clean-targets ^{:protect false} ["resources/public/js/compiled" "target"]
  :cljsbuild {:builds
              [{:id "compiler"
                :compiler
                {:asset-path "target/compiler"
                 :main relajso.compiler
                 :optimizations :simple
                 :output-dir "target/compiler"
                 :output-to "target/relajso-compiler.js"
                 :target :nodejs}
                :source-paths ["src"]}
               {:id "test"
                :compiler
                {:asset-path "target/test"
                 :main relajso.test.runner
                 :optimizations :none
                 :output-dir "target/test"
                 :output-to "target/relajso-test.js"
                 :source-map true
                 :target :nodejs}
                :source-paths ["src" "test"]}]}
  :hooks [leiningen.cljsbuild])
