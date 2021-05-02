'use strict';

import * as express from 'express';
import * as sqlite3 from 'sqlite3';

import { db } from '../Database';

export class GroceryRouter {
    public router: express.Router;

    private static get(req: express.Request, res: express.Response, next: express.NextFunction): void {
      const result = [];
      db.serialize(() => {
        db.each('SELECT id, name, quantity, unit, tag, shelfLife, rateOfConsumption FROM grocery ORDER BY tag, name', (err, row) => {
          const quantity = row.quantity ? parseFloat(row.quantity) : 0;
          const nextItem = {id: row.id, name: row.name, quantity, unit: row.unit, tag: row.tag, shelfLife: row.shelfLife, rateOfConsumption: row.rateOfConsumption};
          result.push(nextItem);
        }, () => {
          res.send(result);
        });
      });
    }
    
    private static set_prop(req: express.Request, res: express.Response, next: express.NextFunction): void {
      db.serialize(() => {
        const run_cmd = `UPDATE grocery SET ${req.params.prop} = $val WHERE id = $id`;
        console.log(run_cmd);
        db.run(run_cmd, {
          $val: req.params.val,
          $id: req.params.id
        // tslint:disable-next-line
        }, function(err) {
          if (err) {
            console.error(err);
            res.send(err);
          } else {
            res.send({success: true});
          }
        });
      });
    }

    private static upsert_item(req: express.Request, res: express.Response, next: express.NextFunction): void {
      if (req.params.id) {
        db.run('UPDATE grocery SET name = $name where id = $id', {
          $name: req.params.name,
          $id: req.params.id
        // tslint:disable-next-line
        }, function(err) {
          if (err) {
            console.error(err);
            res.send(err);
          } else {
            res.send({success: true});
          }
        });
      } else {
        const insertQuantity = 1;
        const insertResult = db.run('INSERT INTO grocery (name, quantity) values ($name, $quantity)', {
          $name: req.params.name,
          $quantity: insertQuantity
        // tslint:disable-next-line
        }, function(err) { /* this function cannot be a fat-arrow or there is no 'this' */
          if (err) {
            console.error(err);
          } else {
            res.send({success: true, item: { id: this.lastID, name: req.params.name, quantity: insertQuantity} });
          }
        });
      }
    }

    private static remove_item(req: express.Request, res: express.Response, next: express.NextFunction): void {
      db.serialize(() => {
        db.run('DELETE FROM grocery WHERE id = $id', {
          $id: req.params.id
        // tslint:disable-next-line
        }, function(err) {
          if (err) {
            console.error(err);
            res.send(err);
          } else {
            res.send({success: true});
          }
        });
      });
    }

    private static calculateNewQuantity(rowQuantity, userQuantity) {
      let quantity = 0;
      try {
        quantity = parseFloat(rowQuantity);
        if (!quantity) {
          quantity = 0;
        }
      } catch (ex) {
        console.error('Failed to parse ' + rowQuantity + ' as float');
      }
      quantity += parseFloat(userQuantity);
      quantity = quantity >= 0 ? quantity : 0;
      return quantity;
    }

    private static adjust_item(req: express.Request, res: express.Response, next: express.NextFunction): void {
      db.serialize(() => {
        db.get('SELECT quantity from grocery where id = $id', {
          $id: req.params.id
        }, (err, row) => {
          if (err) {
            console.error(err);
            res.send(err);
          } else {
            const quantity = GroceryRouter.calculateNewQuantity(row.quantity, req.params.quantity);
            db.run('UPDATE grocery SET quantity = $quantity where id = $id',
              {
                $quantity: quantity,
                $id: req.params.id
              // tslint:disable-next-line
              }, function(updateErr) {
                if (updateErr) {
                  console.error(updateErr);
                  res.send(updateErr);
                } else {
                  res.send({ id: req.params.id, quantity});
                }
              }
            );
          }
        });
      });
    }

    public constructor() {
        this.router = express.Router({mergeParams: true});
        this.init();
    }

    private init(): void {
        this.router.put('/grocery/:id/quantity/:quantity', GroceryRouter.adjust_item);
        this.router.put('/grocery/:id/:prop/:val', GroceryRouter.set_prop);
        this.router.post('/grocery/:name', GroceryRouter.upsert_item);
        this.router.delete('/grocery/:id', GroceryRouter.remove_item);
        this.router.get('/grocery', GroceryRouter.get);
    }
}
