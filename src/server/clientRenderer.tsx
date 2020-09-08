'use strict';

import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpackConfig from '../../webpack/client';

import * as Mustache from 'mustache';
import * as React from 'react';
import Logging from './Logging';

import clientIndexTemplate = require('./clientIndex.mustache');

const clientRouter: express.Router = express.Router();

/* istanbul ignore next */
function renderClient(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.url.startsWith('/static/') || req.url.startsWith('/api/')) {
        return;
    }

    res.send(renderFullPage('', {}));
}

/* istanbul ignore next */
function renderFullPage(html: string, preloadedState: any) {
    return Mustache.render(clientIndexTemplate(), {
        title: 'ReduxTemplate',
        html
    });
}

/* istanbul ignore if */
if (process.env.NODE_ENV === 'dev') {
    const compiler = (module as any).hot.data && (module as any).hot.data.compiler ?
        (module as any).hot.data.compiler : webpack(webpackConfig as webpack.Configuration);
    const devmiddleware = (module as any).hot.data && (module as any).hot.data.devmiddleware ?
        (module as any).hot.data.devmiddleware :
        webpackDevMiddleware(compiler, {
            noInfo: false,
            publicPath: webpackConfig.output.publicPath
        });
    const hotmiddleware = (module as any).hot.data && (module as any).hot.data.hotmiddleware ?
        (module as any).hot.data.hotmiddleware :
        webpackHotMiddleware(compiler);
    clientRouter.use(devmiddleware);
    clientRouter.use(hotmiddleware);
    clientRouter.use(renderClient);

    if ((module as any).hot) {
        (module as any).hot.addDisposeHandler((data: any) => {
            Logging.defaultLogger.error('HMR Disposing Client Middleware');
            data.compiler = compiler;
            data.devmiddleware = devmiddleware;
            data.hotmiddleware = hotmiddleware;
        });
        (module as any).hot.accept((err: any) => {
            Logging.defaultLogger.error('HMR Error', err);
        });
    }
} else {
    Logging.defaultLogger.info('Serving static bundles at /static');
    clientRouter.use('/static', express.static('./dist/static'));
    clientRouter.use(renderClient);
}

export default clientRouter;
