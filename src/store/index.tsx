import React from 'react';
import { observable } from 'mobx';
import HOC from '../core/hoc';

const wrapLibrary = (library: { [key: string]: any; }) => {
  const result: { [key: string]: any; } = {};
  for (const [key, value] of Object.entries(library)) {
    result[key] = HOC(value);
  }
  return result;
};

// TODO 没有解决的问题:
// TODO 1. 动态修改 schema 怎么办
// TODO 2. 组件内要是想使用这套能力怎么办
export default class Store {
  @observable schema: any[];
  @observable entrepot: Map<string, any> = new Map();
  library: Map<string, any>;

  constructor({
    schema = [],
    library,
  }: {
    schema: any[];
    library: { [key: string]: any; }
  }) {
    this.library = new Map(Object.entries(wrapLibrary(library)));
    if (!Array.isArray(schema)) {
      schema = [schema];
    }
    this.schema = schema;
  }

  checkIn = (id: string, val: { [key: string]: any; }) => {
    if (this.entrepot.has(id)) {
      // TODO 冲突解决
      // TODO 清理 store
      console.warn('已存在同名组件:', id, val);
    }
    this.entrepot.set(id, val);
  };

  render = (inn: any) => {
    const TargetComponent = this.library.get(inn.type);

    if (!TargetComponent) {
      return null;
    }

    return <TargetComponent schema={inn} />;
  };

  changeElementData = (id: string, key: string, value: any) => {
    const component = this.entrepot.get(id);
    if (component) {
      // TODO 这里需要确认到底怎么改 (& key 如果是 path 怎么办)
      component[key] = value;
    } else {
      console.warn('changeElementData 找不到对应组件:', id, key, value);
    }
  };
}
