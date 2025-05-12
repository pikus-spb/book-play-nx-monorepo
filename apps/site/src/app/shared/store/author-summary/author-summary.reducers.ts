import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  loadAuthorSummaryFailureAction,
  loadAuthorSummarySuccessAction,
} from './author-summary.actions';
import { initialState } from './author-summary.state';

export const authorSummaryReducers = createReducer(
  initialState,

  on(loadAuthorSummarySuccessAction, (state, action) => {
    return {
      ...state,
      author: action.summary,
    };
  }),

  on(loadAuthorSummaryFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => initialState)
);
