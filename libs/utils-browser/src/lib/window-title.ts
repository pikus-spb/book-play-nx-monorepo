import {
  DEFAULT_TITLE_CONTEXT,
  DEFAULT_TITLE_PREFIX,
} from '@book-play/constants';

export function setWindowTitle(title: string): void {
  if (document.title !== title) {
    document.title = title;
  }
}

export function setDocumentTitleWithContext(context: string): void {
  const title = [context, DEFAULT_TITLE_CONTEXT, DEFAULT_TITLE_PREFIX];
  setWindowTitle(title.join(' - '));
}
