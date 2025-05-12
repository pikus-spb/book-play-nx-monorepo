import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  loadGenreAuthorsFailureAction,
  loadGenreAuthorsSuccessAction,
} from './genre-authors.actions';

import { initialState } from './genre-authors.state';

export const genreAuthorsReducers = createReducer(
  initialState,

  on(loadGenreAuthorsSuccessAction, (state, action) => {
    return {
      ...state,
      authors: action.authors,
    };
  }),

  on(loadGenreAuthorsFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => initialState)
);
