export function log(message: any, ...args: any[]): void {
  const now = new Date();
  const date = now.toLocaleDateString('ru-RU');
  const time = now.toLocaleTimeString('ru-RU');
  console.log(`${date} ${time}: ${message}`, ...args);
}
