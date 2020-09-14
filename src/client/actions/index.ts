'use strict';

import { IItemMap } from '../state';
import * as r2 from 'r2';

export interface ILoadPantryAction {
  type: 'LOAD_PANTRY';
  items: IItemMap[];
}

export interface IUpdatePantryAction {
  type: 'UPDATE_PANTRY';
  id: number;
  name: string;
  quantity: number;
  unit: string;
  tag: string;
}

export interface IAddItemToPantryAction {
  type: 'ADD_ITEM_TO_PANTRY';
  name: string;
}

export interface IRemoveItemFromPantryAction {
  type: 'REMOVE_ITEM_FROM_PANTRY';
  id: number;
}

export type Action = ILoadPantryAction | IUpdatePantryAction | IRemoveItemFromPantryAction | IAddItemToPantryAction;

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
          type: 'UPDATE_PANTRY',
          id,
          name
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
      type: 'UPDATE_PANTRY',
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

export function setUnit(id, unit): Action {
  return async (dispatch) => {
    const updateResponse = await r2.put('http://localhost:4000/api/grocery/grocery/' + id + '/unit/' + unit).json;
    dispatch({
      type: 'UPDATE_PANTRY',
      id: parseInt(id, 10),
      unit
    });
  };
}

export function setTag(id, tag): Action {
  return async (dispatch) => {
    const updateResponse = await r2.put('http://localhost:4000/api/grocery/grocery/' + id + '/tag/' + tag).json;
    dispatch({
      type: 'UPDATE_PANTRY',
      id,
      tag
    });
  };
}

export function setStore(id, tag): Action {
  return async (dispatch) => {
    const updateResponse = await r2.put('http://localhost:4000/api/grocery/grocery/' + id + '/store/' + store).json;
    dispatch({
      type: 'UPDATE_PANTRY',
      id,
      store
    });
  };
}
