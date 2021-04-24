const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const api = "http://localhost:5000";
const port = 3000;

module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "./src/client/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "index_bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    // {
                    //     loader: "css-loader",
                    //     options: {
                    //         modules: true,
                    //     },
                    // },
                ],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, "./public/template.html"),
            filename: "index.html",
        }),
        new CleanWebpackPlugin(),
        new HotModuleReplacementPlugin(),
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: [
            path.resolve(__dirname, "./dist"),
            path.resolve(__dirname, "./src/client/asserts"),
        ],
        open: true,
        compress: true,
        hot: true,
        port: port,
        proxy: {
            "/api": {
                target: api,
                pathRewrite: { "^/api": "" },
            },
        },
    },
};
