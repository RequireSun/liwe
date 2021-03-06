import React from 'react';
import { observable } from 'mobx';
import Base from './wrapper/base';
import Label from './wrapper/label';
import { id } from '../util/generator';

export interface SchemaNode {
  id: string;
  type: string;
}

const wrapLibrary = (library: { [key: string]: any; }) => {
  const result: { [key: string]: any; } = {};
  for (const [key, value] of Object.entries(library)) {
    result[key] = Base(Label(value));
  }
  return result;
};

// TODO 没有解决的问题:
// TODO 1. 动态修改 schema 怎么办
// TODO 2. 组件内要是想使用这套能力怎么办
export default class Store {
  @observable schema: SchemaNode[];
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

  render = (inn: SchemaNode) => {
    // TODO 搞个 schema 预处理模块, 不要在逻辑里搞兼容, 逻辑里只负责进行检查, 过不了就报错
    if (!inn.id) {
      inn.id = `comp_${id()}`;
    }

    const TargetComponent = this.library.get(inn.type);

    if (!TargetComponent) {
      return null;
    }

    return <TargetComponent schema={inn} key={inn.id} />;
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
