import { BasicBookData, Errors } from '@book-play/models';

export interface BookSearchState {
  books: BasicBookData[] | null;
  errors: Errors;
}

export const initialState: BookSearchState = {
  books: null,
  errors: [],
};
