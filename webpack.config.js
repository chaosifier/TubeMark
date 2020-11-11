const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./app/options/options.js",
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
  output: {
    path: path.resolve(__dirname, "app/", "dist/"),
    publicPath: "app/dist/", //TODO what does publicPath do?
    filename: "options.js"
  }
};
