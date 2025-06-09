import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  loadRandomAuthorsActionFailure,
  loadRandomAuthorsActionSuccess,
} from './random-author-summary.actions';
import { initialState } from './random-author-summary.state';

export const randomAuthorSummaryReducers = createReducer(
  initialState,

  on(loadRandomAuthorsActionSuccess, (state, action) => {
    return {
      ...state,
      authors: action.authors,
    };
  }),

  on(loadRandomAuthorsActionFailure, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => ({ ...initialState }))
);
