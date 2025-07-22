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
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      log(`${String(propertyKey)}(${JSON.stringify(args)})`);

      const result = originalMethod.apply(this, args);
      if (result instanceof Promise) {
        return result.then((res) => {
          log(`Result: ${JSON.stringify(res)}`);
          return res;
        });
      } else {
        log(`Result: ${JSON.stringify(result)}`);
      }
      return result;
    };

    return descriptor;
  };
}
