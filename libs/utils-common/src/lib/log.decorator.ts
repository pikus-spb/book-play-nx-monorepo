import { log } from './logger';

/**
 * A method decorator that logs method invocations, including the method name,
 * arguments, and return value.
 *
 * @example
 *
 * class Example {
 *   @Log()
 *   greet(name: string): string {
 *     return `Hello, ${name}!`;
 *   }
 * }
 *
 *
 * @param target - The prototype of the class or the object to which the decorated
 *                 method is added.
 * @param propertyKey - The name of the decorated method.
 * @param descriptor - The property descriptor for the decorated method.
 * @returns A modified property descriptor with logging behavior.
 */
export function Log(): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    function text(data: any): string {
      return JSON.stringify(data).substring(0, 200) + '...';
    }

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      log(`${String(propertyKey)}( ${text(args)})`);

      const result = originalMethod.apply(this, args);
      if (result instanceof Promise) {
        return result.then((res) => {
          log('Result: ' + text(res));
          return res;
        });
      } else {
        log('Result: ' + text(result));
      }
      return result;
    };

    return descriptor;
  };
}
