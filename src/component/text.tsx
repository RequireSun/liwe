import React from 'react';

import './text.css';

export interface Props {
  value?: string;
}

export default class Text extends React.Component<Props, any> {
  render() {
    const { value = '' } = this.props;
    return (
      <span className="liwe-standard-text">{value}</span>
    );
  }
}
