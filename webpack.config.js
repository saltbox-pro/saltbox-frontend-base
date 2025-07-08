const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");
/* const CopyPlugin = require("copy-webpack-plugin"); */

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
        "saltbox-shared": path.resolve(__dirname, "../saltbox-frontend-shared/src"),
        "saltbox-core-api": path.resolve(__dirname, "../saltbox-frontend-core/src/api/generated"),
        "saltbox-core": path.resolve(__dirname, "../saltbox-frontend-core/src"),
        "saltbox-base": path.resolve(__dirname, "../saltbox-frontend-base/src"),
        "saltbox-flow": path.resolve(__dirname, "../saltbox-frontend-flow/src"),
        "saltbox-root-config": path.resolve(__dirname, "../saltbox-frontend-root-config/src"),
      },
    },
    module: {
      /* rules: [
        new CopyPlugin({
          patterns: [
            { from: "public/locales", to: "locales" },
          ],
        }),
      ], */
    },
  });

  config.externals = [];

  return config;
};
