import React from 'react';

export interface Props {
  options?: {
    label: string;
    value: string | number;
  }[];
  value?: string;
  onChange: (key: string, value: any) => void;
}

export default class Select extends React.Component<Props, any> {
  onChange = (e: any) => {
    this.props.onChange('value', e.target.value);
  };
  render() {
    const { value = '', options = [], onChange } = this.props;
    return (
      <select value={value} onChange={this.onChange}>
        {options.map(item => <option value={item.value}>{item.label}</option>)}
      </select>
    );
  }
}
