import React from 'react';
import { observer, inject } from 'mobx-react';
import Store from '../store';
import curry from '../util/curry';
import { id } from '../util/generator';
import genGetter from './getter';

const SYM_WATCHERS = Symbol('watchers');

export interface Props {
  schema: any;
  store: Store;
  TargetComponent: any;
}

// 注意: 我这里目前还是没有断路的纯变量替换, 改成编译器实现后应该就可以编译 & 动态监听了
@inject('store')
@observer
export class HOC extends React.Component<Props, any> {
  [SYM_WATCHERS]: (keyof HOC)[];

  // TODO 事件监听
  constructor(props: Props) {
    super(props);
    const { store, schema } = props;
    if (!schema.id) {
      schema.id = `comp_${id()}`;
    }

    const { original, getter } = genGetter(this);

    store.checkIn(schema.id, original);

    Object.defineProperties(this, getter);
    this[SYM_WATCHERS] = Object.keys(getter) as (keyof HOC)[];
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
    const watched = this[SYM_WATCHERS].reduce((obj: any, key: keyof HOC) => {
      obj[key] = this[key];
      return obj;
    },{});

    // 动态属性
    const val = entrepot.get(schema.id) || {};

    return <TargetComponent onChange={curry(changeElementData, schema.id)} {...otherProps} {...val} {...watched} />;
  }
}

export default function hoc(TargetComponent: any) {
  return (props: any) => <HOC {...props} TargetComponent={TargetComponent} />;
}
