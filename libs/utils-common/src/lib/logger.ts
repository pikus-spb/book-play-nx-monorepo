export function log(message: any, ...args: any[]): void {
  const now = new Date();
  const date = now.toLocaleDateString('ru-RU');
  const time = now.toLocaleTimeString('ru-RU');
  console.log(`${date} ${time}: ${message}`, ...args);
}

export function error(err: any) {
  const message =
    'Error: ' + (err.sqlMessage || err.message || JSON.stringify(err));
  log(message);
}
