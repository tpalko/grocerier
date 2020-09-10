'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { IInventory, IPantry, ICategories, IItemMap } from '../state';
import { Action,
  getInventory,
  removeStock,
  setTag,
  setUnit,
  updateStock,
  upsertStock
} from '../actions';
import Category from './categorizer';

interface IInventoryProps {
}

interface IInventoryOwnProps {
  pantry: IPantry;
  categories: ICategories;
}

interface IInventoryState {
  upsertId: undefined;
  upsertName: '';
  upsertTag: undefined;
  upsertUnit: undefined;
}

const INITIAL_STATE = { upsertId: undefined, upsertName: '', upsertTag: undefined, upsertUnit: undefined };

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

    private editItem(item: IItemMap) {
      this.setState({ upsertId: item.id, upsertName: item.name, upsertTag: item.tag, upsertUnit: item.unit });
      this.upsertItemInput.focus();
    }

    private remove(e: any) {
      e.preventDefault();
      this.props.removeStock(e.target.value);
    }

    private save(e: any) {
      e.preventDefault();
      this.props.upsertStock(this.state.upsertId, this.state.upsertName);
      this.setState(INITIAL_STATE);
      this.upsertItemInput.focus();
    }

    private upsertDisplay(categories) {
      return (
        <div>
          <input
            ref={(input) => { this.upsertItemInput = input; }}
            value={ this.state.upsertName }
            onChange={(e) => {
              this.setState({ upsertName: e.target.value });
            }} /> <button ref='ok' onClick={this.save}>ok</button>
          { this.state.upsertId ? <Category categories={categories.tags} setter={this.props.setTag} id={this.state.upsertId} value={this.state.upsertTag} /> : '' }
          { this.state.upsertId ? <Category categories={categories.units} setter={this.props.setUnit} id={this.state.upsertId} value={this.state.upsertUnit} /> : '' }
        </div>
      );
    }

    public render() {
        const {pantry, categories} = this.props;

        const display = pantry.items ? pantry.items.map((i) =>
          <div key={i.id}>
            <strong>[ {i.tag} ] {i.name}: </strong>{i.quantity} { i.unit !== 'none' ? i.unit : '' }
            <a
              style={{marginLeft: 3 + 'px'}}
              href='#'
              onClick={(e) => { e.preventDefault(); this.editItem(i); }}>edit
            </a>
            <form>
              <button ref='increment' value={i.id} onClick={this.increment}>+</button>
              <button ref='decrement' value={i.id} onClick={this.decrement}>-</button>
              <button ref='remove' value={i.id} onClick={this.remove}>remove</button>
              { !i.tag ? <Category categories={categories.tags} setter={this.props.setTag} id={i.id} /> : '' }
              { !i.unit ? <Category categories={categories.units} setter={this.props.setUnit} id={i.id} /> : '' }
            </form>
          </div>
        ) : '';
        return (
            <div>
                <div className='hero'>
                    {this.upsertDisplay(categories)}
                    {display}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IInventory) {
    return {
        pantry: state.pantry,
        categories: state.categories
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
