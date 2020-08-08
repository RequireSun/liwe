import React from 'react';
import { observable } from 'mobx';
import HOC from '../core/hoc';

export default class Store {
  @observable schema: any[];
  @observable beeLine: Map<string, any> = new Map();
  library: Map<string, any>;

  constructor({
    schema = [],
    library,
  }: {
    schema: any[];
    library: { [key: string]: any; }
  }) {
    this.library = new Map(Object.entries(this.doWrap(library)));
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

  doWrap = (library: { [key: string]: any; }) => {
    return Object.entries(library).reduce((lib, [key, value]) => {
      lib[key] = HOC(value);
      return lib;
    }, {} as { [key: string]: any; });
  };

  changeElementData = (id: string, key: string, value: any) => {
    const component = this.beeLine.get(id);
    if (component) {
      // TODO 这里需要确认到底怎么改 (& key 如果是 path 怎么办)
      component[key] = value;
    } else {
      console.warn('changeElementData 找不到对应组件:', id, key, value);
    }
  };
}
