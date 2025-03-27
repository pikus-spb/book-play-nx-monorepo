export function getCurrentProtocolUrl(
  host: string,
  port: string,
  portSecure: string
): string {
  return `${location.protocol}//${host}:${
    location.protocol === 'http' ? port : portSecure
  }`;
}
