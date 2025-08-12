import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  activeBookFailureAction,
  activeBookSuccessAction,
} from './active-book.actions';
import { initialActiveBookState } from './active-book.state';

export const activeBookReducers = createReducer(
  initialActiveBookState,

  on(activeBookSuccessAction, (state, action) => {
    return {
      ...state,
      activeBook: action.book,
    };
  }),

  on(activeBookFailureAction, (state, action) => {
    return {
      ...state,
      errors: action.errors,
    };
  }),

  on(routerNavigationAction, () => ({ ...initialActiveBookState }))
);
