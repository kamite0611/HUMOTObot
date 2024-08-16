const path = require("path");
const GasPlugin = require("gas-webpack-plugin");
const CopyFilePlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = () => ({
  devtool: false,
  context: __dirname,
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new GasPlugin(),
    new CopyFilePlugin({
      patterns: [
        {
          context: path.resolve(__dirname, "./"),
          from: path.resolve(__dirname, "./appsscript.json"),
          to: path.resolve(__dirname, "./dist"),
        },
        {
          context: path.resolve(__dirname, "./"),
          from: path.resolve(__dirname, "./package*.json"),
          to: path.resolve(__dirname, "./dist"),
        },
      ],
    }),
  ],
});
