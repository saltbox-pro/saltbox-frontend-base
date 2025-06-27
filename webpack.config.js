const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");

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
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.module\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]--[hash:base64:5]",
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  });

  config.externals = [];

  return config;
};
