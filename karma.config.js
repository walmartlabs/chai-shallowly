"use strict";

module.exports = function (config) {
  config.set({
    files: [
      "test/client-entry.js"
    ],

    frameworks: ["mocha"],

    preprocessors: {
      "test/client-entry.js": [ "webpack", "sourcemap" ]
    },

    reporters: [ "spec" ],

    singleRun: true,

    webpack: {
      devtool: "source-map",
      externals: {
        jsdom: "window",
        cheerio: "window",
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true
      },
      resolve: {
        root: [__dirname],
        modulesDirectories: ["node_modules"],
        extensions: ["", ".js", ".jsx"],
        alias: {
          sinon: require.resolve("sinon/pkg/sinon")
        }
      },
      module: {
        noParse: [
          /node_modules\/sinon\//,
          /fsevents/
        ],
        loaders: [
          {
            exclude: /node_modules/,
            loader: "babel-loader",
            test: /\.jsx?$/
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    browsers: ["PhantomJS"]
  });
};
