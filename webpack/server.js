/* tslint:disable */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');
const noop = require('noop-webpack-plugin');
const staticLoaders = require('./staticLoaders');

const isDev = process.env.NODE_ENV === 'dev';
const isTest = process.env.NODE_ENV === 'test';
const happyPackThreadPool = HappyPack.ThreadPool({size: require('os').cpus().length - 1});

const config = {
    target: 'node',
    devtool: isDev ? 'source-map' : 'nosources-source-map',
    entry: isDev ? ['webpack/hot/poll?1000', './src/server/index.ts'] : ['./src/server/index.ts'],
    externals: [nodeExternals({whitelist: [/^webpack\/hot/]})],
    output: {filename: 'server.bundle.js', path: path.resolve(__dirname, '..', 'dist')},
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
            {
                test: /\.mustache$/,
                loader: 'mustache-loader?minify'
            },
            {test: /\.css$/, use: ['css-loader']},
            {test: /\.scss$/, use: ['sass-loader']},
            {test: /\.less$/, use: ['css-loader', 'less-loader']},
            ...staticLoaders
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
          options: {
            cleanDb: process.env.CLEAN_DB === 'true' ? true : false 
          }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        isDev ? new WebpackShellPlugin({onBuildEnd: ['node dist/server.bundle.js']}) : noop(),
        isDev ? new webpack.HotModuleReplacementPlugin() : noop(),
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
