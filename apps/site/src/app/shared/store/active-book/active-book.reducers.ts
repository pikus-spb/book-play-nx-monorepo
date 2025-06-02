import { routerNavigationAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import {
  activeBookFailureAction,
  activeBookSuccessAction,
} from './active-book.actions';
import { initialState } from './active-book.state';

export const activeBookReducers = createReducer(
  initialState,

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

  on(routerNavigationAction, () => ({ ...initialState }))
);
