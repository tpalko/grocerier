'use strict';

import * as sqlite3 from 'sqlite3';

const db = new sqlite3.Database('grocery.db');

export default class Database {
  public static initialize(wipe: boolean = false): void {
    db.serialize(() => {
      // if (wipe) {
      //   db.get('SELECT name FROM grocery', (err, row) => {
      //     if (!err) {
      //       console.log('*******************************');
      //       console.log('*****                     *****');
      //       console.log('*****  DROPPING DATABASE  *****');
      //       console.log('*****                     *****');
      //       console.log('*******************************');
      //       db.run('DROP TABLE grocery');
      //       Database.initialize();
      //     }
      //   });
      // }
      db.get('SELECT name FROM grocery', (err, row) => {
        if (err) {
          console.log('*******************************');
          console.log('*****                     *****');
          console.log('*****  CREATING DATABASE  *****');
          console.log('*****                     *****');
          console.log('*******************************');
          db.run('CREATE TABLE grocery (id INTEGER PRIMARY KEY, name TEXT, quantity INT, unit TEXT, tag TEXT, shelfLife TEXT, rateOfConsumption TEXT)');
        }
      });
    });
  }
}

module.exports = { Database, db };
