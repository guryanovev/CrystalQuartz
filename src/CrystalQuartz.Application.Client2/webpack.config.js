const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env) => {
  const envSpecific =
    env && env.demo
      ? {
          entry: ['./src_demo/index.ts'],
          outputPath: path.resolve(__dirname, './../../Artifacts/gh-pages/demo'),
          outputPublicPath: '',
          indexTemplate: 'src_demo/index.html',
          defineVersion: true,
        }
      : {
          entry: [],
          outputPath: path.resolve(__dirname, 'dist'),
          outputPublicPath: '?v=[hash]&path=',
          indexTemplate: './index.html',
          defineVersion: false,
        };

  const envSpecificPlugins = envSpecific.defineVersion
    ? [
        new webpack.DefinePlugin({
          CQ_VERSION: JSON.stringify(env && env.v ? env.v : 'unknown'),
        }),
      ]
    : [];

  return {
    entry: [...envSpecific.entry, './src/index.ts', './src/index.scss'],
    devtool: 'inline-source-map',
    watchOptions: {
      ignored: '/node_modules/',
    },
    target: ['web', 'es5'],
    plugins: [
      new HtmlWebpackPlugin({
        template: envSpecific.indexTemplate,
        scriptLoading: 'defer',
      }),
      new MiniCssExtractPlugin({
        filename: 'application.css',
        chunkFilename: '[id].css',
      }),
      new BundleAnalyzerPlugin(),
      ...envSpecificPlugins,
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
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
      clean: true,
    },
  };
};
