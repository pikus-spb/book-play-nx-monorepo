import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  loadRandomBooksFailureAction,
  loadRandomBooksSuccessAction,
} from './random-books.actions';
import { initialRandomBooksState } from './random-books.state';

export const randomBooksReducers = createReducer(
  initialRandomBooksState,

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

  on(routerNavigationAction, () => ({ ...initialRandomBooksState }))
);
