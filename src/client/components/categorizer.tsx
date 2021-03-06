'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { IItemMap } from '../state';

interface ICategoryProps {
  categoryName: string;
  categories: string[];
  setter: any;
  id: number;
  value: string;
}

interface ICategoryOwnProps {
}

interface ICategoryState {
  value: string;
}

class Category extends React.Component<ICategoryProps & ICategoryOwnProps, ICategoryState> {

  constructor(props: any) {
    super(props);
    this.state = { value: this.props.value };
  }

  public render() {
    const { categories, setter } = this.props;
    return (
      <div key={this.props.categoryName}>
          <b>{ this.props.categoryName }</b> {categories.map((u) => {
            return (
              <a
                key=`${this.props.categoryName}_${u}`
                style={{ marginRight: 3 + 'px', fontWeight: this.state.value !== undefined && this.state.value === u ? 'bold' : '' }}
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ value: u });
                  setter(this.props.id, this.props.categoryName, u);
                }}
              >
                {u}
              </a>
            );
          })}
     </div>
   );
 }
}

function mapStateToProps(state: IUpsertItem) {
    return {
    };
}

export default connect(mapStateToProps, {
})(Category);
