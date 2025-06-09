import { AuthorSummary, Errors } from '@book-play/models';

export interface RandomAuthorSummaryState {
  authors: AuthorSummary[];
  errors: Errors;
}

export const initialState: RandomAuthorSummaryState = {
  authors: [],
  errors: [],
};
