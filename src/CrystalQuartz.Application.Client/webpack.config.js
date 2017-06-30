var ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require("webpack"),
    path = require('path');

module.exports = {
    entry: './index.ts',
    output: {
        filename: 'application.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '?v=[hash]&path='
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ use: "css-loader" })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader!less-loader" })
            },
            {
                test: /\.tmpl\.html$/, loader: "html-loader"
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)|\.gif($|\?)/,
                loader: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.placeholder\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
        new webpack.ProvidePlugin({ js: 'exports-loader?js!' + path.resolve(__dirname, 'lib/john-smith') }),
        new ExtractTextPlugin({ filename: "application.css", allChunks: true }),
        new HtmlWebpackPlugin({ template: "index.placeholder.html", inject: false })//,
    ]
};