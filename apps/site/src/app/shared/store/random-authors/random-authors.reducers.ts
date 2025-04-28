import { createReducer, on } from '@ngrx/store';
import {
  loadRandomAuthorsActionFailure,
  loadRandomAuthorsActionSuccess,
} from './random-authors.actions';
import { initialState } from './random-authors.state';

export const randomAuthorsReducers = createReducer(
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
  })
);
