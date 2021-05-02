'use strict';

export interface IShoppingList {
  items: IItemMap[];
}

export interface IInventory {
  pantry: IPantry;
  categories: ICategories;
}

export interface ICategories {
  tags: string[];
  units: string[];
  rates_of_consumption: string[];
  shelf_lifes: string[];
}

export interface IPantry {
  items: IItemMap[];
}

export interface IItemMap {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  tag: string;
  shelfLife: string;
  rateOfConsumption: string;
}
