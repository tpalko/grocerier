'use strict';

export interface IInventory {
  pantry: IPantry;
  categories: ICategories;
}

export interface ICategories {
  tags: string[];
  units: string[];
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
}
