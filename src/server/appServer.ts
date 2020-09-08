'use strict';

import * as express from 'express';
import { ApiRouter } from './api/ApiRouter';
import clientRenderer from './clientRenderer';
import Logging from './Logging';
import 'source-map-support/register';
import 'isomorphic-fetch';

const appServer: express.Application = express();

Logging.initialize(appServer);

appServer.use('/api', (new ApiRouter()).router);
appServer.use(clientRenderer);

export default appServer;
