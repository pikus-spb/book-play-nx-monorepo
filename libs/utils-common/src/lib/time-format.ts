export function secondsToTimeString(time: number): string {
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor((time - hours * 60 * 60) / 60);

  return `${hours}:${minutes}`;
}

export function timeStringToSeconds(time: string): number {
  const parts = time.split(':');

  return Number(parts[0]) * 60 * 60 + Number(parts[1]) * 60;
}
