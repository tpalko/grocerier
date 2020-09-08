/* tslint:disable */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const noop = require('noop-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const staticLoaders = require('./staticLoaders');

const isDev = process.env.NODE_ENV === 'dev';
const happyPackThreadPool = HappyPack.ThreadPool({size: require('os').cpus().length - 1});

const config = {
    target: 'web',
    devtool: isDev ? 'source-map' : 'nosources-source-map',
    entry: isDev ?
        ['webpack-hot-middleware/client', 'react-hot-loader/patch', './src/client/index.tsx'] :
        ['./src/client/index.tsx'],
    output: {
        filename: 'client.bundle.js',
        publicPath: '/static/',
        path: path.resolve(__dirname, '..', 'dist/static')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                loaders: ['happypack/loader?id=tslint'],
                exclude: /(node_modules)/
            },
            {
                test: /\.tsx?$/,
                loaders: ['happypack/loader?id=tsx']
            },
            isDev ?
                {test: /\.css$/, use: ['style-loader', 'css-loader']} :
                {test: /\.css$/, use: ExtractTextPlugin.extract(['css-loader'])},
            isDev ?
                {test: /\.scss$/, use: ['raw-loader', 'sass-loader']} :
                {test: /\.scss$/, use: ExtractTextPlugin.extract(['sass-loader'])},
            isDev ?
                {test: /\.less/, use: ['style-loader', 'css-loader', 'less-loader']} :
                {test: /\.less$/, use: ExtractTextPlugin.extract(['css-loader', 'less-loader'])},
            ...staticLoaders
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        isDev ? new webpack.HotModuleReplacementPlugin() : noop(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HappyPack({
            id: 'tslint',
            threadPool: happyPackThreadPool,
            loaders: [{
                loader: 'tslint-loader'
            }]
        }),
        new HappyPack({
            id: 'tsx',
            threadPool: happyPackThreadPool,
            loaders: [{
                loader: 'react-hot-loader/webpack'
            }, {
                loader: 'ts-loader',
                options: {
                    happyPackMode: true,
                    configFile: 'src/tsconfig.json'
                }
            }]
        })
    ]
};

module.exports = config;