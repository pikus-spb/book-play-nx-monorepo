import { Errors, GenreAuthor } from '@book-play/models';

export interface GenreAuthorsState {
  authors: GenreAuthor[];
  errors: Errors;
}

export const initialState: GenreAuthorsState = {
  authors: [],
  errors: [],
};
