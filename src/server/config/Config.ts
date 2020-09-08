'use strict';

export class Config {
    public static serverPort: number = typeof(process.env.SERVER_PORT) !== 'undefined' ?
        /* istanbul ignore next */ Number.parseInt(process.env.SERVER_PORT) : 4000;
    public static cleanDb: boolean = typeof(process.env.CLEAN_DB) !== 'undefined'
      && process.env.CLEAN_DB === 'true' ? true : false;
}

export default new Config();
