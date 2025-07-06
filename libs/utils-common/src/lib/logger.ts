import { environment } from 'environments/environment';

export function log(message: any, ...args: any[]): void {
  if (environment.production) {
    return;
  }
  console.log('DEV: ' + message, ...args);
}
