export default function curry(fn: (...args: any[]) => any, ...args: any[]): (...args: any[]) => any {
  return function (...argv: any[]) {
    if (args.length + argv.length < fn.length) {
      return curry(fn, ...args, ...argv);
    } else {
      return fn(...args, ...argv);
    }
  }
}

export function countable(fn: (...args: any[]) => any, count?: number): (...args: any) => any {
  return function curried(...args: any[]) {
    const limit = undefined !== count ? count : fn.length;
    if (args.length >= limit) {
      return fn(...args);
    } else {
      return function (...argv: any[]) {
        return curried(...args, ...argv);
      };
    }
  }
}
