var webpack = require('webpack'),
  path = require('path');

module.exports = function (env) {
  //    var plugins = [
  //        new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
  //    ];

  return {
    entry: './dev/dev-server.ts',
    target: 'node',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist-dev-server'),
      //publicPath: envSpecific.outputPublicPath
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.dev-server.json'),
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  };
};
