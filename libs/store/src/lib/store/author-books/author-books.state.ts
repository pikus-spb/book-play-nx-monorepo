import { Book, Errors } from '@book-play/models';

export interface AuthorBooksState {
  authorBooks: Book[];
  errors: Errors;
}

export const initialAuthorBooksState: AuthorBooksState = {
  authorBooks: [],
  errors: [],
};
