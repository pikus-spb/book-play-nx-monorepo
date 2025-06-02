import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import { initialState } from './random-books';
import {
  loadRandomBooksFailureAction,
  loadRandomBooksSuccessAction,
} from './random-books.actions';

export const randomBooksReducers = createReducer(
  initialState,

  on(loadRandomBooksSuccessAction, (state, action) => {
    return {
      ...state,
      books: action.books,
      errors: [],
    };
  }),
  on(loadRandomBooksFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => ({ ...initialState }))
);
