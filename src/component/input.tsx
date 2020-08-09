import React from 'react';

export interface Props {
  value?: string;
  onChange: (key: string, value: any) => void;
}

export default class Input extends React.Component<Props, any> {
  onChange = (e: any) => {
    this.props.onChange('value', e.target.value);
  };

  render() {
    const { value = '' } = this.props;
    return (
      <input className="liwe-standard-input" type="text" value={value} onChange={this.onChange}/>
    );
  }
}
