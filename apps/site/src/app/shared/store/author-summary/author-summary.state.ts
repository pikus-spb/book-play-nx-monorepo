import { AuthorSummary, Errors } from '@book-play/models';

export interface AuthorSummaryState {
  author: AuthorSummary | null;
  errors: Errors;
}

export const initialState: AuthorSummaryState = {
  author: null,
  errors: [],
};
