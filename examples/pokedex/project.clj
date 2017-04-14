(defproject relajso-pokedex "0.1.0-SNAPSHOT"
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
                 [org.clojure/clojure "1.9.0-alpha14"]
                 [org.clojure/clojurescript "1.9.518"]
                 [relajso "0.1.0-SNAPSHOT"]
                 [sablono "0.8.1-SNAPSHOT"]
                 [secretary "1.2.3"]]
  :plugins [[lein-figwheel "0.5.10"]
            [lein-cljsbuild "1.1.5" :exclusions [[org.clojure/clojure]]]]
  :profiles {:dev {:dependencies [[binaryage/devtools "0.9.2"]
                                  [com.cemerick/piggieback "0.2.1"]
                                  [figwheel-sidecar "0.5.10"]]
                   :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}
                   :resource-paths ["test-resources"]
                   :source-paths ["src" "dev"]}}
  :clean-targets ^{:protect false} ["resources/public/js/compiled" "target"]
  :cljsbuild {:builds
              [{:id "dev"
                :compiler {:main pokedex.core
                           :asset-path "js/compiled/out"
                           :output-to "resources/public/js/compiled/pokedex.js"
                           :output-dir "resources/public/js/compiled/out"
                           :source-map-timestamp true
                           ;; To console.log CLJS data-structures make sure you enable devtools in Chrome
                           ;; https://github.com/binaryage/cljs-devtools
                           :preloads [devtools.preload]}
                :figwheel {:on-jsload "pokedex.core/on-js-reload"}
                :source-paths ["src"]}
               {:id "min"
                :compiler {:output-to "resources/public/js/compiled/pokedex.js"
                           :main pokedex.core
                           :optimizations :advanced
                           :pseudo-names false
                           :pretty-print false}
                :source-paths ["src"]}]}
  :figwheel {:css-dirs ["resources/public/css"]})
