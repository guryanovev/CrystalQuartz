const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env) => {
    const envSpecific = env && env.demo ?
        {
            entry: ['./index.ts', './demo/index.ts'],
            outputPath: path.resolve(__dirname, './../../Artifacts/gh-pages/demo'),
            outputPublicPath: '',
            indexTemplate: 'demo/index-demo.placeholder.html',
            defineVersion: true
        } :
        {
            entry: './index.ts',
            outputPath: path.resolve(__dirname, 'dist'),
            outputPublicPath: '?v=[hash]&path=',
            indexTemplate: 'index.placeholder.html',
            defineVersion: false
        };

    return {
        entry: ['./src/index.ts', './src/index.scss'],
        devtool: 'inline-source-map',
        watchOptions: {
            ignored: '/node_modules/',
        },
        target: ['web', 'es5'],
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html',
            }),
            new MiniCssExtractPlugin({
                filename: "application.css",
                chunkFilename: "[id].css",
            }),
            new BundleAnalyzerPlugin(),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'application.js',
            path: envSpecific.outputPath,
            publicPath: envSpecific.outputPublicPath,
            clean: true
        }
    }
};
