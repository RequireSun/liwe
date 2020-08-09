import React from 'react';
import Liwe from './core/liwe';
import Select from './component/select';
import Input from './component/input';
import Text from './component/text';
import logo from './logo.svg';

import './App.css';

class App extends React.Component {
  state = {
    schema: [{
      id: 'input_1',
      type: 'Input',
      label: 'Input',
    }, {
      type: 'Text',
      value: '${input_1.value}',
      label: '动态展示在这里',
    }, {
      type: 'Select',
      options: '(${input_1.value} || "").split(",").filter(item => item).map(str => ({ label: str, value: str, }))',
      label: '通过逗号分隔新增元素',
    }],
    library: {
      Select,
      Input,
      Text,
    },
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    const { schema, library } = this.state;

    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <Liwe schema={schema} library={library} />
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
    );
  }
}

export default App;
