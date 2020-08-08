import React from 'react';
import { Provider } from 'mobx-react';
import Layout from './core/layout';
import logo from './logo.svg';
import Store from './store';

import './App.css';

class App extends React.Component {
  store: Store;

  constructor(props: any) {
    super(props);
    this.store = new Store({
      schema: [],
      library: {},
    });
  }

  render() {
    return (
      <Provider store={this.store}>
        <Layout />
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;
