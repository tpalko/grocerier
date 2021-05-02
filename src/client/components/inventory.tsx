'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { IInventory, IPantry, ICategories, IItemMap } from '../state';
import { Action,
  getInventory,
  removeStock,
  setProp,
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
  upsertShelfLife: undefined;
  upsertRateOfConsumption: undefined;
  matchingItems: IItemMap[];
}

const INITIAL_STATE = { upsertId: undefined, upsertName: '', upsertTag: undefined, upsertUnit: undefined, upsertShelfLife: undefined, upsertRateOfConsumption:  undefined, matchingItems: [] };

class Inventory extends React.Component<IInventoryProps & IInventoryOwnProps, IInventoryState> {

    constructor(props: any) {
        super(props);
        this.props.getInventory();

        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.remove = this.remove.bind(this);
        this.editItem = this.editItem.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.typeahead = this.typeahead.bind(this);

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
      this.setState({ upsertId: item.id, upsertName: item.name, upsertTag: item.tag, upsertUnit: item.unit, upsertShelfLife: item.shelfLife, upsertRateOfConsumption: item.rateOfConsumption });
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
    
    private cancel(e: any) {
      e.preventDefault();
      this.setState(INITIAL_STATE);
    }
    
    private typeahead(e: any) {
      this.setState({ upsertName: e.target.value });
      if (!this.state.upsertId && e.target.value.length > 0) {
        const matchingItems = this.props.pantry.items.filter((i) => { 
          const startsWith = false;
          let startsWithFilter = '';
          if (startsWith) {
            startsWithFilter = '^';
          }
          const matches = i.name.match(startsWithFilter + e.target.value); 
          return matches && matches.length > 0; 
        });
        this.setState({ matchingItems: matchingItems });
      } else {
        this.setState({ matchingItems: [] });
      }
    }

    private upsertDisplay() {
      const { categories } = this.props;
      return (
        <div>
          <input
            ref={(input) => { this.upsertItemInput = input; }}
            value={ this.state.upsertName }
            onChange={ this.typeahead } /> 
            <button ref='ok' onClick={this.save}>ok</button> 
            <button ref='cancel' onClick={this.cancel}>cancel</button> 
            
          { this.state.matchingItems.length > 0 ? 
            <div>
              { 
                this.state.matchingItems.map((m) => { 
                  return (
                    <div 
                      key={m.id} 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        this.setState({ matchingItems: [] }); 
                        this.editItem(m); 
                      }}
                    >
                      {m.name}
                    </div>
                  ); 
                }) 
              }
            </div> : '' }
          { /* only if upsertId is set, show the categories' selections */ }
          { this.state.upsertId ? <Category categoryName="tag" categories={categories.tags} setter={this.props.setProp} id={this.state.upsertId} value={this.state.upsertTag} /> : '' }
          { this.state.upsertId ? <Category categoryName="unit" categories={categories.units} setter={this.props.setProp} id={this.state.upsertId} value={this.state.upsertUnit} /> : '' }
          { this.state.upsertId ? <Category categoryName="shelfLife" categories={categories.shelf_lifes} setter={this.props.setProp} id={this.state.upsertId} value={this.state.upsertShelfLife} /> : '' }
          { this.state.upsertId ? <Category categoryName="rateOfConsumption" categories={categories.rates_of_consumption} setter={this.props.setProp} id={this.state.upsertId} value={this.state.upsertRateOfConsumption} /> : '' }
        </div>
      );
    }

    public render() {
        const { pantry } = this.props;

        const display = pantry.items ? pantry.items.map((i) =>
          <div key={i.id}>
            <strong>[ {i.tag} ] {i.name}: </strong>{i.quantity} { i.unit !== 'none' ? i.unit : '' }
            <a
              style={{marginLeft: 3 + 'px'}}
              href='#'
              onClick={(e) => { e.preventDefault(); this.editItem(i); }}>edit
            </a>
            <div>
              shelf life: {i.shelfLife}
            </div>
            <div>
              unit consumed in: {i.rateOfConsumption}
            </div>
            <form>
              <button ref='increment' value={i.id} onClick={this.increment}>+</button>
              <button ref='decrement' value={i.id} onClick={this.decrement}>-</button>
              <button ref='remove' value={i.id} onClick={this.remove}>remove</button>
              { /* !i.tag ? <Category categories={categories.tags} setter={this.props.setTag} id={i.id} /> : '' }
              { !i.unit ? <Category categories={categories.units} setter={this.props.setUnit} id={i.id} /> : '' */ }
            </form>
          </div>
        ) : '';
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
        pantry: state.pantry,
        categories: state.categories
    };
}

export default connect(mapStateToProps, {
  getInventory,
  updateStock,
  upsertStock,
  setProp,
  removeStock
})(Inventory);
