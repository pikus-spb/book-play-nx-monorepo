import { Book, Errors } from '@book-play/models';

export interface BookSummaryState {
  summary: Book | null;
  errors: Errors;
}

export const initialState: BookSummaryState = {
  summary: null,
  errors: [],
};
