'use strict';

import * as http from 'http';
import appServer from './appServer';
import { Config } from './config/Config';
import Logging from './Logging';
import { Database } from './Database';

Database.initialize(Config.cleanDb);

let server: http.Server = getServer();

if (process.env.NODE_ENV === 'dev' && (module as any).hot) {
    (module as any).hot.addDisposeHandler((data: any) => {
        data.server = server;
    });

    (module as any).hot.accept();

    if (typeof(server) !== 'undefined') {
        server.removeAllListeners('request');
        server.addListener('request', appServer);
        onServerHmr();
    } else {
        onServerStart();
    }
} else {
    onServerStart();
}

/**
 * Called on initial start-up, but not during HMR cycles.
 */
function onServerStart(): void {
    Logging.defaultLogger.info('Starting Server');
    startListener();
}

/**
 * Called on HMR cycles, but not on initial startup.
 */
function onServerHmr(): void {
    Logging.defaultLogger.info('Starting Server HMR Load');
}

/**
 * Pulls the server object from the HMR module's data param. This is how we pass state between HMR cycles.
 * @returns {http.Server}
 */
function getServer(): http.Server {
    if (process.env.NODE_ENV === 'dev' && (module as any).hot) {
        if ((module as any).hot.data && (module as any).hot.data.server) {
            return (module as any).hot.data.server;
        }
    }

    return;
}

/**
 * Starts the HTTP listener
 */
function startListener(): void {
    server = http.createServer(appServer);
    server.listen(Config.serverPort);
    Logging.defaultLogger.info(`Started server on port ${Config.serverPort}`);
}
