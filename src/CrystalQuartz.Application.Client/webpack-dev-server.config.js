var webpack = require("webpack"),
    path = require('path');

module.exports = function(env) {
//    var plugins = [
//        new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
//    ];

    return {
        entry: './dev-server.ts',
        target: 'node',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist-dev-server')
            //publicPath: envSpecific.outputPublicPath
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        //plugins: plugins,
        node: { // A workaround. Remove once https://github.com/webpack-contrib/css-loader/issues/447 is fixed
            fs: 'empty'
        }
    };
}