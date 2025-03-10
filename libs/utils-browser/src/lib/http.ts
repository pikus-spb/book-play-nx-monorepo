export function createQueryString(options: Record<string, string>): string {
  return Object.keys(options)
    .map((key: string) => `${key}=${options[key]}`)
    .join('&');
}
