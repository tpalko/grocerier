'use strict';

const staticLoaders = [
    {
        test: /\.png$/,
        use: [
            {
                loader: 'url-loader',
                query: {
                    options: {
                        prefix: 'img',
                        limit: 5000
                    }
                }
            }
        ]
    },
    {
        test: /\.jpg/,
        use: [
            {
                loader: 'url-loader',
                query: {
                    options: {
                        prefix: 'img',
                        limit: 5000
                    }
                }
            }
        ]
    },
    {
        test: /\.gif/,
        use: [
            {
                loader: 'url-loader',
                query: {
                    options: {
                        prefix: 'img',
                        limit: 5000
                    }
                }
            }
        ]
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
            {
                loader: 'url-loader',
                query: {
                    options: {
                        mimetype: 'application/font-woff',
                        limit: 10000
                    }
                }
            }
        ]
    },
    {test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: ['file-loader']},
    {
        test: /\.ttf(\?v=\d+.\d+.\d+)?$/, use: {
        loader: 'file-loader', options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
        }
    }
    },
    {
        test: /\.svg(\?v=\d+.\d+.\d+)?$/,
        use: {loader: 'file-loader', options: {limit: 10000, mimetype: 'image/svg+xml'}}
    },
    {test: /\.html$/, use: ['raw-loader']}
];

module.exports = staticLoaders;
