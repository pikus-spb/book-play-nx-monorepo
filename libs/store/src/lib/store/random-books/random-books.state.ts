import { Book, Errors } from '@book-play/models';

export interface RandomBooksState {
  books: Book[];
  errors: Errors;
}

export const initialRandomBooksState: RandomBooksState = {
  books: [],
  errors: [],
};
