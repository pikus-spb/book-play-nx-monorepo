import {
  AUTHOR_TITLE_CONTEXT,
  BOOK_SEARCH_TITLE_CONTEXT,
  BOOK_TITLE_CONTEXT,
  DEFAULT_TITLE_PREFIX,
} from '@book-play/constants';

export function setWindowTitle(title: string): void {
  if (document.title !== title) {
    document.title = title;
  }
}

export function setDocumentBookTitleWithContext(context: string): void {
  setWindowTitle(getBookPageTitle(context));
}

export function getBookPageTitle(bookName: string): string {
  return [bookName, BOOK_TITLE_CONTEXT, DEFAULT_TITLE_PREFIX].join(' - ');
}

export function getAuthorPageTitle(authorName: string): string {
  return [authorName, AUTHOR_TITLE_CONTEXT, DEFAULT_TITLE_PREFIX].join(' - ');
}

export function getBookSearchPageTitle(query?: string | null): string {
  const parts = [BOOK_SEARCH_TITLE_CONTEXT, DEFAULT_TITLE_PREFIX];
  if (query) {
    parts.unshift(`"${query}"`);
  }
  return parts.join(' - ');
}
