export function createQueryString(options: any): string {
  return Object.keys(options)
    .map((key: string) => `${key}=${options[key]}`)
    .join('&');
}
