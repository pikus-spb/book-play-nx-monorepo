import { Author, Errors } from '@book-play/models';

export interface RandomAuthorsState {
  authors: Author[];
  errors: Errors;
}

export const initialState: RandomAuthorsState = {
  authors: [],
  errors: [],
};
