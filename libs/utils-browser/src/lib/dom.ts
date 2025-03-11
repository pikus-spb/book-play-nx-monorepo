import {
  DEFAULT_COVER_SRC,
  PARAGRAPH_CLASS_PREFIX,
} from '@book-play/constants';

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

export function getParagraphNode(
  element: HTMLElement,
  index: number
): HTMLElement | null {
  return element.querySelector(`.${PARAGRAPH_CLASS_PREFIX}${index}`);
}

export function filterTextParagraphs(paragraphs: string[]): string[] {
  return paragraphs.filter((item) => isTextParagraph(item));
}

export function isTextParagraph(paragraph: string): boolean {
  return !paragraph.startsWith('{');
}
