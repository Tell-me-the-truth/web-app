const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "./app.js",
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
    ],
    target: "web",
    output: {
        path: path.join(__dirname, "assets/js/"),
        filename: "_bundle.js"
    }
};