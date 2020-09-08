'use strict';

import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as winston from 'winston';

export default class Logging {
    public static defaultLogger: winston.Winston = winston;

    public static initialize(router: express.Router): void {
        /* istanbul ignore else */
        if (typeof(process.env.NODE_ENV) !== 'undefined' && process.env.NODE_ENV === 'test') {
            Logging.defaultLogger.configure({
                transports: []
            });
        } else {
            Logging.defaultLogger.configure({
                transports: [
                    new (winston.transports.Console)({
                        colorize: true,
                        level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info'
                    })
                ]
            });
        }

        router.use(expressWinston.logger({
            winstonInstance: Logging.defaultLogger,
            meta: true,
            msg: 'HTTP {{req.method}} {{req.url}}',
            expressFormat: true,
            colorize: true
        }));

        router.use(expressWinston.errorLogger({
            winstonInstance: Logging.defaultLogger
        }));

        Logging.defaultLogger.info('Initialized winston');
    }
}
