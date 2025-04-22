export function getCurrentProtocolUrl(
  host: string,
  port: number,
  portSecure: number
): string {
  return `${location.protocol}//${host}:${
    location.protocol === 'http:' ? port : portSecure
  }`;
}
