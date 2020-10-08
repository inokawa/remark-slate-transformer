const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src",
  output: {
    path: path.join(__dirname, "lib"),
    filename: "index.js",
    library: "[name]",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
};
