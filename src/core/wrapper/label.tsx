import React from 'react';

import './label.css';

export class Label extends React.Component<any, any> {
  render() {
    const {
      schema,
      TargetElement,
      ...otherProps
    } = this.props;

    if (schema.label) {
      return (
        <div className="liwe-standard-line">
          <label className="liwe-standard-label">{schema.label}</label>
          <TargetElement schema={schema} {...otherProps} />
        </div>
      );
    } else {
      return <TargetElement schema={schema} {...otherProps} />
    }
  }
}

export default function label(TargetElement: any) {
  return (props: any) => <Label {...props} TargetElement={TargetElement} />;
}
