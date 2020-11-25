const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    options: './app/options/options.js',
    popup: './app/popup/popup.js',
  },
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
    path: path.resolve(__dirname, "app/public/build"),
    filename: "[name].js"
  }
};
