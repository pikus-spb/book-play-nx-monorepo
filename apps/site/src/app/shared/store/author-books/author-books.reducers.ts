import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  loadAuthorBooksFailureAction,
  loadAuthorBooksSuccessAction,
} from './author-books.actions';
import { initialState } from './author-books.state';

export const authorBooksReducers = createReducer(
  initialState,

  on(loadAuthorBooksSuccessAction, (state, action) => {
    return {
      ...state,
      authorBooks: action.books,
    };
  }),

  on(loadAuthorBooksFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => initialState)
);
