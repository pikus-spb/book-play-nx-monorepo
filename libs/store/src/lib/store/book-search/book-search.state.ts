import { BookData, Errors } from '@book-play/models';

export interface BookSearchState {
  books: BookData[] | null;
  errors: Errors;
}

export const initialBookSearchState: BookSearchState = {
  books: null,
  errors: [],
};
