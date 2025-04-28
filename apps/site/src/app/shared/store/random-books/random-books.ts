import { Book, Errors } from '@book-play/models';

export interface RandomBooks {
  books: Book[];
  errors: Errors;
}

export const initialState: RandomBooks = {
  books: [],
  errors: [],
};
