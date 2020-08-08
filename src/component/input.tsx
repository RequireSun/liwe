import React from 'react';
import curry from '../util/curry';

export interface Props {
  value?: string;
  onChange: (key: string, value: any) => void;
}

export default class Input extends React.Component<Props, any> {
  render() {
    const { value = '', onChange } = this.props;
    return (
      <input type="text" value={value} onChange={curry(onChange, 'value')}/>
    );
  }
}
