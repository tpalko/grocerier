'use strict';

import { combineReducers } from 'redux';
import { IInventory } from '../state';
import {
  Action,
  ILoadPantryAction,
  IUpdatePantryAction,
  IRemoveItemFromPantryAction,
  IAddItemToPantryAction
} from '../actions';

const initial = { units: [], tags: [] };
const initialPantry = { items: [] };

function defaultReducer(state = initial, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}

function pantryReducer(state = initialPantry, action: Action) {
    switch (action.type) {
      case 'LOAD_PANTRY':
        return { items: (action as ILoadPantryAction).items };
      case 'ADD_ITEM_TO_PANTRY':
        return {
          items: [
            {
              id: (action as IAddItemToPantryAction).id,
              name: (action as IAddItemToPantryAction).name,
              quantity: (action as IAddItemToPantryAction).quantity
            },
            ...state.items
          ]
        };
      case 'REMOVE_ITEM_FROM_PANTRY':
        return {
          items: [
            ...state.items.filter((i) => {
              return i.id !== (action as IRemoveItemFromPantryAction).id;
            })
          ]
        };
      case 'UPDATE_PANTRY':
        const id = (action as IUpdatePantryAction).id;
        const name = (action as IUpdatePantryAction).name;
        const quantity = (action as IUpdatePantryAction).quantity;
        const unit = (action as IUpdatePantryAction).unit;
        const tag = (action as IUpdatePantryAction).tag;
        return {
          items: [
            ...state.items.map((i) => {
              return i.id !== id ? i : {
                id,
                name: name !== undefined ? name : i.name,
                quantity: quantity !== undefined ? quantity : i.quantity,
                unit: unit !== undefined ? unit : i.unit,
                tag: tag !== undefined ? tag : i.tag
              };
            })
          ]
        };
      default:
        return state;
    }
}

// Global reducer definition - maps reducers to pieces of state
export default combineReducers<IInventory>({
    pantry: pantryReducer,
    categories: defaultReducer
});
