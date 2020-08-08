import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export default class Layout extends React.Component<any, any> {
  render() {
    return (
      <>
        {this.props.store.schema.map(this.props.store.render)}
      </>
    );
  }
}
