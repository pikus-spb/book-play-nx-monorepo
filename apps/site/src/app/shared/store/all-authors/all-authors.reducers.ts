import { createReducer, on } from '@ngrx/store';
import {
  loadAllAuthorsFailureAction,
  loadAllAuthorsSuccessAction,
} from './all-authors.actions';

import { initialState } from './all-authors.state';

export const allAuthorsReducers = createReducer(
  initialState,

  on(loadAllAuthorsSuccessAction, (state, action) => {
    return {
      ...state,
      authors: action.authors,
    };
  }),

  on(loadAllAuthorsFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  })
);
