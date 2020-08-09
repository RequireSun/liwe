import Select from './component/select';
import Input from './component/input';
import Text from './component/text';
import Liwe from './core/liwe';
import React from "react";

export default class LiweDemo extends React.Component<any, any> {
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
      label: '通过逗号分隔新增选项',
    }],
    library: {
      Select,
      Input,
      Text,
    },
  };

  render() {
    const { schema, library } = this.state;

    return (
      <Liwe schema={schema} library={library} />
    )
  }
}
