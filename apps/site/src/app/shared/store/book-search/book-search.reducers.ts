import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  bookSearchFailureAction,
  bookSearchSuccessAction,
} from './book-search.actions';

import { initialState } from './book-search.state';

export const bookSearchReducers = createReducer(
  initialState,

  on(bookSearchSuccessAction, (state, action) => {
    return {
      ...state,
      books: action.books,
    };
  }),

  on(bookSearchFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => ({ ...initialState }))
);
