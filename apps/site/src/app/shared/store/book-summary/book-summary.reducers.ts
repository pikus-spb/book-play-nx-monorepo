import { createReducer, on } from '@ngrx/store';
import {
  loadBookSummaryFailureAction,
  loadBookSummarySuccessAction,
} from './book-summary.actions';
import { initialState } from './book-summary.state';

export const bookSummaryReducers = createReducer(
  initialState,

  on(loadBookSummarySuccessAction, (state, action) => {
    return {
      ...state,
      summary: action.summary,
    };
  }),

  on(loadBookSummaryFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  })
);
