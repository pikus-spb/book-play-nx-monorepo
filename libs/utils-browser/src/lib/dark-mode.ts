export function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function listenDarkModeChange(
  callback: (isDarkMode: boolean) => void
): void {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event: MediaQueryListEvent) => {
      callback(event.matches);
    });
}
