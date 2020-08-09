/**
 * 解析 schema 中的计算表达式, 并创建 getter
 */
import get from 'lodash/get';
import { Base } from './wrapper/base';

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

export default function genGetter(component: Base): { getter: PropertyDescriptorMap, original: { [key: string]: any; } } {
  const getter: PropertyDescriptorMap = {};
  const original: { [key: string]: any; } = {};

  for (const [key, expression] of Object.entries(component.props.schema)) {
    // TODO 路径判断
    if (!EXCLUDES.has(key)) {
      if (typeof expression === 'object') {
        if (expression) {
          // TODO 深度监听替换
          // TODO 暂时将没有替换的当做原始值存入 store
          original[key] = expression;
        }
      } else if (typeof expression === 'string') {
        const propNames = genNames(expression);
        const replacedExpression = propNames.reduce((expr, path, index) => {
          // TODO 这里先随便写了, 后面想个完全的替换方案
          return expression.replace(`\${${path}}`, `arguments[${index}]`);
        }, expression);

        if (replacedExpression === expression) {
          // 没有替换的当做原始值存入 store
          original[key] = expression;
        } else {
          const func = new Function(...uselessName(propNames.length), `return ${replacedExpression}`);

          getter[key] = {
            get(): any {
              const val = propNames.reduce(function (arr: any[], path) {
                const [compId, ...deep] = path.split('.');
                const original = component.props.store.entrepot.get(compId);
                // TODO 看看默认值用什么好
                // TODO 属性里不能有点
                arr.push(get(original, deep.join('.'), ''));
                return arr;
              }, []);
              return func(...val);
            }
          };
        }
      }
    }
  }

  return {
    getter,
    original,
  };
};
