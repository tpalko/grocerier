'use strict';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { GroceryRouter } from './GroceryRouter';

/**
 * All routes prefixed by:  /api
 */
export class ApiRouter {
    public router: express.Router;

    public constructor() {
        this.router = express.Router({mergeParams: true});
        this.router.use(bodyParser.urlencoded({ extended: true }));
        this.init();
    }

    private init() {
        this.router.use('/grocery', (new GroceryRouter()).router);
    }
}
