const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "saltbox",
    projectName: "base",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  const config = merge(defaultConfig, {
    devServer: {
      port: 4201,
    },
    resolve: {
      alias: {
        "saltbox-core": path.resolve(__dirname, "../saltbox-frontend-core/src"),
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "public/locales", to: "locales" }],
      }),
      new webpack.DefinePlugin({
        DEVELOPMENT: argv.mode === "development",
        PRODUCTION: argv.mode === "production",
      }),
    ],
    output: {
      filename: "index.js",
    },
  });

  config.externals = [];

  return config;
};
