import { Book, Errors } from '@book-play/models';

export interface ActiveBookState {
  activeBook: Book | null;
  errors: Errors | null;
}

export const initialActiveBookState: ActiveBookState = {
  activeBook: null,
  errors: null,
};
