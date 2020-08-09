import React from 'react';
import { observer, Provider } from 'mobx-react';
import Store from './store';

import './liwe.css';

export interface Props {
  schema: any[];
  library: { [key: string]: any; };
}

@observer
export default class Liwe extends React.Component<Props, any> {
  store: Store;

  constructor(props: Props) {
    super(props);

    (window as any).__store__ = this.store = new Store(props);
  }

  render() {
    return (
      <Provider store={this.store}>
        <div className="liwe-standard-container">
          {this.store.schema.map(this.store.render)}
        </div>
      </Provider>
    );
  }
}
