import { BookData, Errors } from '@book-play/models';

export interface BookSearchState {
  books: BookData[] | null;
  errors: Errors;
}

export const initialState: BookSearchState = {
  books: null,
  errors: [],
};
