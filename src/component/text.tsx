import React from 'react';

export interface Props {
  value?: string;
}

export default class Text extends React.Component<Props, any> {
  render() {
    const { value = '' } = this.props;
    return (
      <span>{value}</span>
    );
  }
}
