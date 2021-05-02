'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { IShoppingList, IPantry, ICategories, IItemMap } from '../state';
import { Action, getShoppingList } from '../actions';

interface IShoppingListProps {
}

interface IShoppingListOwnProps {
}

interface IShoppingListState {
}

class ShoppingList extends React.Component<IShoppingListProps & IShoppingListOwnProps, IShoppingListState> {

    constructor(props: any) {
        super(props);
        this.props.getShoppingList();
    }

    public render() {
        // const { } = this.props;
        
        return (
            <div></div>
        );
    }
}

function mapStateToProps(state: any) {
    return {};
}

export default connect(mapStateToProps, { getShoppingList })(ShoppingList);
