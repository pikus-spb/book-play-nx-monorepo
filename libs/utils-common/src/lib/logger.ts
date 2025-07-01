import { environment } from 'environments/environment';

export function log(message: string, ...args: any[]): void {
  if (environment.production) {
    return;
  }
  console.log(message, ...args);
}
