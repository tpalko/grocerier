'use strict';

import { IItemMap } from '../state';
import * as r2 from 'r2';

export interface ILoadPantryAction {
  type: 'LOAD_PANTRY';
  items: IItemMap[];
}

export interface IUpdatePantryAction {
  type: 'UPDATE_ITEM_QUANTITY';
  id: number;
  quantity: number;
}

export interface IUpdatePantryPropAction {
  type: 'UPDATE_PANTRY_PROP';
  id: number;
  prop: string;
  val: string;
}

export interface IAddItemToPantryAction {
  type: 'ADD_ITEM_TO_PANTRY';
  name: string;
}

export interface IRemoveItemFromPantryAction {
  type: 'REMOVE_ITEM_FROM_PANTRY';
  id: number;
}

export type Action = ILoadPantryAction | IUpdatePantryAction | IUpdatePantryPropAction | IRemoveItemFromPantryAction | IAddItemToPantryAction;

export function getShoppingList(): Action {
  return async (dispatch) => {
    const resp = await r2('http://localhost:4000/api/grocery/list').json;
    dispatch({
      type: 'LOAD_SHOPPING_LIST',
      items: resp
    })
  }
}

export function getInventory(): Action {
  return async (dispatch) => {
    const resp = await r2('http://localhost:4000/api/grocery/grocery').json;
    dispatch({
      type: 'LOAD_PANTRY',
      items: resp
    });
  };
}

export function upsertStock(id, name): Action {
  return async (dispatch) => {
    let updateResponse;
    if (!id) {
      updateResponse = await r2.post('http://localhost:4000/api/grocery/grocery/' + name).json;
      if (updateResponse.success) {
        dispatch({
          type: 'ADD_ITEM_TO_PANTRY',
          id: updateResponse.item.id,
          name: updateResponse.item.name,
          quantity: updateResponse.item.quantity
        });
      }
    } else {
      updateResponse = await r2.put('http://localhost:4000/api/grocery/grocery/' + id + '/name/' + name).json;
      if (updateResponse.success) {
        dispatch({
          type: 'UPDATE_PANTRY_PROP',
          id,
          prop: 'name',
          val: name
        });
      }
    }
  };
}

export function updateStock(id, quantity): Action {
  return async (dispatch) => {
    const updateResponse = await r2
      .put('http://localhost:4000/api/grocery/grocery/' + id + '/quantity/' + quantity)
      .json;
    dispatch({
      type: 'UPDATE_ITEM_QUANTITY',
      id: parseInt(id, 10),
      quantity: updateResponse.quantity
    });
  };
}

export function removeStock(id: number): Action {
  return async (dispatch) => {
    const updateResponse = await r2.delete(`http://localhost:4000/api/grocery/grocery/${id}`).json;
    if (updateResponse.success === true) {
      dispatch({
        type: 'REMOVE_ITEM_FROM_PANTRY',
        id: parseInt(id, 10)
      });
    }
  };
}

export function setProp(id, prop, val): Action {
  return async (dispatch) => {
    const updateResponse = await r2.put('http://localhost:4000/api/grocery/grocery/' + id + '/' + prop + '/' + val).json;
    dispatch({
      type: 'UPDATE_PANTRY_PROP',
      id: parseInt(id, 10),
      prop,
      val
    });
  };
}
