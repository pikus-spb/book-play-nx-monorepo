import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  loadBookSummaryFailureAction,
  loadBookSummarySuccessAction,
  resetBookSummaryAction,
} from './book-summary.actions';
import { initialBookSummaryState } from './book-summary.state';

export const bookSummaryReducers = createReducer(
  initialBookSummaryState,

  on(loadBookSummarySuccessAction, (state, action) => {
    return {
      ...state,
      summary: action.summary,
    };
  }),

  on(resetBookSummaryAction, () => {
    return {
      ...initialBookSummaryState,
    };
  }),

  on(loadBookSummaryFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => ({ ...initialBookSummaryState }))
);
