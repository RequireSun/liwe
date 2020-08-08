import React from 'react';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import Store from '../store';
import curry from '../util/curry';
import { id } from '../util/generator';

const SYM_WATCHERS = Symbol('watchers');
const EXCLUDES = new Set(['type']);

function* genReg(str: string) {
  const REG_PROP = /\$\{([^}]*)}/g;
  let matches;

  while (matches = REG_PROP.exec(str)) {
    yield matches[1] as string;
  }
}

function* uselessName(len: number) {
  while(len) {
    yield 'a'.repeat(len--);
  }
}

const genNames = (str: string): string[] => {
  return [...((new Set([...genReg(str)])) as Set<string>)];
};

// 注意: 我这里目前还是没有断路的纯变量替换, 改成编译器实现后应该就可以编译 & 动态监听了
@observer
class HOC extends React.Component<any, any> {
  [SYM_WATCHERS]: (keyof HOC)[];

  // TODO 事件监听
  constructor(props: any) {
    super(props);
    const { store, schema }: { store: Store; schema: any; } = props;
    if (!schema.id) {
      schema.id = `comp_${id()}`;
    }
    store.checkIn(this);

    const watchers = Object.entries(schema).reduce(function (properties, [key, expression]) {
      // TODO 路径判断
      if (!EXCLUDES.has(key)) {
        if (typeof expression === 'object') {
          if (expression) {
            // TODO 深度监听替换
          }
        } else if (typeof expression === 'string') {
          const propNames = genNames(expression);
          const replacedExpression = propNames.reduce((expr, path, index) => {
            // TODO 这里先随便写了, 后面想个完全的替换方案
            return expression.replace(`${path}`, `arguments[${index}]`);
          }, expression);
          const func = new Function(...uselessName(propNames.length), `return ${replacedExpression}`);

          properties[key] = {
            get(): any {
              propNames.reduce((arr: any[], path) => {
                // TODO 看看默认值用什么好
                arr.push(get((this as HOC).props.store.beeLine, path, ''));
                return arr;
              }, []);
              return func(...propNames);
            }
          };
        }
      }
      return properties;
    }, {} as PropertyDescriptorMap);
    Object.defineProperties(this, watchers);
    this[SYM_WATCHERS] = Object.keys(watchers) as (keyof HOC)[];
  }

  render() {
    const {
      TargetComponent,
      changeElementData,
      schema,
      ...otherProps
    } = this.props;

    const watched = this[SYM_WATCHERS].reduce((obj: any, key: keyof HOC) => {
      obj[key] = this[key];
      return obj;
    },{});

    return <TargetComponent onChange={curry(changeElementData, schema.id)} {...otherProps} {...watched} />;
  }
}

export default function hoc(TargetComponent: any) {
  return (...args: any[]) => <HOC {...args} TargetComponent={TargetComponent} />;
}
