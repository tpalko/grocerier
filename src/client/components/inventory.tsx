'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { IInventory } from '../state';
import { Action,
  getInventory,
  removeStock,
  setTag,
  setUnit,
  updateStock,
  upsertStock
} from '../actions';

interface IInventoryProps {
}

interface IInventoryOwnProps {
  pantry: IInventory;
}

interface IInventoryState {
  upsertItem: string;
  upsertId: number;
  upsertTag: string;
  upsertUnit: string;
}

const INITIAL_STATE = { upsertId: undefined, upsertItem: '', upsertTag: undefined, upsertUnit: undefined };

class Inventory extends React.Component<IInventoryProps & IInventoryOwnProps, IInventoryState> {

    constructor(props: any) {
        super(props);
        this.props.getInventory();

        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.remove = this.remove.bind(this);
        this.editItem = this.editItem.bind(this);
        this.save = this.save.bind(this);

        this.state = INITIAL_STATE;
    }

    private increment(e: any) {
        e.preventDefault();
        this.props.updateStock(e.target.value, 1);
    }

    private decrement(e: any) {
        e.preventDefault();
        this.props.updateStock(e.target.value, -1);
    }

    private editItem(id, name, tag, unit) {
      this.setState({ upsertId: id, upsertItem: name,  upsertTag: tag, upsertUnit: unit });
      this.upsertItemInput.focus();
    }

    private remove(e: any) {
      e.preventDefault();
      this.props.removeStock(e.target.value);
    }

    private save(e: any) {
      e.preventDefault();
      this.props.upsertStock(this.state.upsertId, this.state.upsertItem);
      this.setState(INITIAL_STATE);
      this.upsertItemInput.focus();
    }

    private tags(id, tag) {
      return (
        <div>
            {['produce',
              'dairy',
              'bread',
              'meats',
              'pasta',
              'baking',
              'drinks',
              'condiments',
              'snacks',
              'clothing',
              'toiletries',
              'household',
              'other']
            .map((t) => {
              return (
                  <a
                    key={t}
                    style={{marginRight: 3 + 'px', fontWeight: tag !== undefined && tag == t ? 'bold': ''}}
                    href='#'
                    onClick={(e) => { e.preventDefault(); if (id === this.state.upsertId) { this.state.upsertTag = t; } this.props.setTag(id, t); }}>
                      {t}
                  </a>
              );
            })}
       </div>
     );
    }

    private units(id, unit) {
      return (
        <div>
            {['none',
              'lb',
              'box',
              'bag',
              'jar',
              'jug',
              'gallon',
              'loaf',
              'bunch',
              'block',
              'bottle',
              'container',
              'carton']
            .map((u) => {
              return (
                <a
                  key={u}
                  style={{marginRight: 3 + 'px', fontWeight: unit !== undefined && unit == u ? 'bold': ''}}
                  href='#'
                  onClick={(e) => { e.preventDefault(); if (id === this.state.upsertId) { this.state.upsertUnit = u; } this.props.setUnit(id, u); }}>{u}
                </a>
              );
            })}
       </div>
     );
    }

    private upsertDisplay() {
      return (
        <div>
          <input
            ref={(input) => { this.upsertItemInput = input; }}
            value={this.state.upsertItem}
            onChange={(e) => {
              this.setState({ upsertItem: e.target.value });
            }} /> <button ref='ok' onClick={this.save}>ok</button>
          { this.state.upsertId ? this.tags(this.state.upsertId, this.state.upsertTag) : '' }
          { this.state.upsertId ? this.units(this.state.upsertId, this.state.upsertUnit) : '' }
        </div>
      );
    }

    public render() {
        const {pantry} = this.props;

        const display = pantry.items.map((i) =>
          <div key={i.id}>
            <strong>[ {i.tag} ] {i.name}: </strong>{i.quantity} { i.unit !== 'none' ? i.unit : '' }
            <a
              style={{marginLeft: 3 + 'px'}}
              href='#'
              onClick={(e) => { e.preventDefault(); this.editItem(i.id, i.name, i.tag, i.unit); }}>edit
            </a>
            <form>
              <button ref='increment' value={i.id} onClick={this.increment}>+</button>
              <button ref='decrement' value={i.id} onClick={this.decrement}>-</button>
              <button ref='remove' value={i.id} onClick={this.remove}>remove</button>
              { !i.tag ? this.tags(i.id) : '' }
              { !i.unit ? this.units(i.id) : '' }
            </form>
          </div>
        );
        return (
            <div>
                <div className='hero'>
                    {this.upsertDisplay()}
                    {display}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IInventory) {
    return {
        pantry: state.pantry
    };
}

export default connect(mapStateToProps, {
  getInventory,
  updateStock,
  setUnit,
  upsertStock,
  setTag,
  removeStock
})(Inventory);
