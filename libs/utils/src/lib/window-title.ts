import {
  DEFAULT_TITLE_CONTEXT,
  DEFAULT_TITLE_PREFIX,
} from '@book-play/constants';

export function setWindowTitle(title: string): void {
  if (document.title !== title) {
    document.title = title;
  }
}

export function setWindowsTitleWithContext(context: string): void {
  const title = [DEFAULT_TITLE_PREFIX, context, DEFAULT_TITLE_CONTEXT];
  setWindowTitle(title.join(' - '));
}
