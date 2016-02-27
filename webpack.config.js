const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    clientPath = path.join(__dirname, 'src');

module.exports = {
    cache: true,
    devtool: 'source-map',
    context: clientPath,
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(clientPath, 'index.js')
    ],
    resolve: {
        root: clientPath,
        extensions: ['', '.css', '.less', '.jsx', '.js', '.json'],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(clientPath, 'index.html')
        }),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery'},
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'}
        ]
    },
    devServer: {
        contentBase: path.join(clientPath, 'index.js'),
        hot: true
    }
};
