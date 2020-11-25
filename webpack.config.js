const path = require("path");
const webpack = require("webpack");

var commonConfig = {
  devtool: 'cheap-module-source-map',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
}

var optionsConfig = Object.assign({}, commonConfig, {
  entry: "./app/options/options.js",
  output: {
    path: path.resolve(__dirname, "app/", "dist/"),
    publicPath: "app/dist/",
    filename: "options.js"
  }
});

var popupConfig = Object.assign({}, commonConfig, {
  entry: "./app/popup/popup.js",
  output: {
    path: path.resolve(__dirname, "app/", "dist/"),
    publicPath: "app/dist/",
    filename: "popup.js"
  }
});

module.exports = [
  optionsConfig, popupConfig
];
