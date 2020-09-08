'use strict';

export interface IInventory {
    pantry: IPantry;
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
