import { Author, Errors } from '@book-play/models';

export interface AllAuthorsState {
  authors: Author[];
  errors: Errors;
}

export const initialState: AllAuthorsState = {
  authors: [],
  errors: [],
};
