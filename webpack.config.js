const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "production";

module.exports = {
  entry: "./client/src/index.tsx",
  mode,
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "client/dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.client.json",
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "client/public", "index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: ["login.html", "signup.html"].map((file) => ({
        from: path.join(__dirname, "client/public", file),
        to: path.join(__dirname, "client/dist", file),
      })),
    }),
  ],
  devtool: "source-map",
  devServer: {
    static: {
      publicPath: "/",
      directory: path.join(__dirname, "client/public"),
    },
    compress: true,
    port: 9000,
    proxy: [
      {
        context: ["/api", "/login", "/signup"],
        target: "http://localhost:3000",
      },
    ],
  },
};
