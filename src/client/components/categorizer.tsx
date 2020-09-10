'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { IItemMap } from '../state';

interface ICategoryProps {
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
      <div>
          {categories.map((u) => {
            return (
              <a
                key={u}
                style={{ marginRight: 3 + 'px', fontWeight: this.state.value !== undefined && this.state.value === u ? 'bold' : '' }}
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ value: u });
                  setter(this.props.id, u);
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
