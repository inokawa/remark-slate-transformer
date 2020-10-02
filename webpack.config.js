const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src",
  output: {
    path: path.join(__dirname, "lib"),
    filename: "index.js",
    library: "slate-remark",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
};
