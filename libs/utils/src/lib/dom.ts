import { DEFAULT_COVER_SRC } from '@book-play/constants';

export function getOuterHeight(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  const margin =
    parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

export function showDefaultCoverImage(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = DEFAULT_COVER_SRC;
}
