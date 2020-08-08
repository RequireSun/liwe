import React from 'react';
import { observable } from 'mobx';

function isMap(obj: any): obj is Map<string, any> {
  return obj instanceof Map;
}

export default class Store {
  @observable schema: any[];
  @observable beeLine: Map<string, any> = new Map();
  library: Map<string, any>;

  constructor({
    schema = [],
    library,
  }: {
    schema: any[];
    library: { [key: string]: any; } | Map<string, any>
  }) {
    if (!isMap(library)) {
      library = new Map(Object.entries(library));
    }
    this.library = library as Map<string, any>;
    if (!Array.isArray(schema)) {
      schema = [schema];
    }
    this.schema = schema;
  }

  checkIn = (component: any) => {
    this.beeLine.set(component.id, component);
  };

  render = (inn: any) => {
    const TargetComponent = this.library.get(inn.type);

    if (!TargetComponent) {
      return null;
    }

    return <TargetComponent schema={inn} />;
  };
}
