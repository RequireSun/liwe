import React from 'react';
import { observer, inject } from 'mobx-react';
import Store, { SchemaNode } from '../store';
import curry from '../../util/curry';
import genGetter from '../getter';

const SYM_WATCHERS = Symbol('watchers');

export interface Props {
  schema: SchemaNode;
  store: Store;
  TargetComponent: any;
}

// 注意: 我这里目前还是没有断路的纯变量替换, 改成编译器实现后应该就可以编译 & 动态监听了
@inject('store')
@observer
export class Base extends React.Component<Props, any> {
  [SYM_WATCHERS]: (keyof Base)[];

  // TODO 事件监听
  constructor(props: Props) {
    super(props);
    const { store, schema } = props;

    const { original, getter } = genGetter(this);

    store.checkIn(schema.id, original);

    Object.defineProperties(this, getter);
    this[SYM_WATCHERS] = Object.keys(getter) as (keyof Base)[];
  }

  render() {
    const {
      store: {
        changeElementData,
        entrepot,
      },
      TargetComponent,
      schema,
      ...otherProps
    } = this.props;

    // getter 属性
    const watched = this[SYM_WATCHERS].reduce((obj: any, key: keyof Base) => {
      obj[key] = this[key];
      return obj;
    },{});

    // 动态属性
    const val = entrepot.get(schema.id) || {};

    return <TargetComponent onChange={curry(changeElementData, schema.id)} schema={schema} {...otherProps} {...val} {...watched} />;
  }
}

export default function hoc(TargetComponent: any) {
  return (props: any) => <Base {...props} TargetComponent={TargetComponent} />;
}
