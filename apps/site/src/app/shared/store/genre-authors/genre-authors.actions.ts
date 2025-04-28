import { Errors, Genre, GenreAuthor } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum GenreAuthorsActions {
  LoadGenreAuthors = '[GenreAuthor] load authors',
  LoadGenreAuthorsSuccess = '[GenreAuthors] load authors success',
  LoadGenreAuthorsFailure = '[GenreAuthors] load authors failure',
}

export const loadGenreAuthorsAction = createAction(
  GenreAuthorsActions.LoadGenreAuthors,
  props<{ genre: Genre }>()
);
export const loadGenreAuthorsSuccessAction = createAction(
  GenreAuthorsActions.LoadGenreAuthorsSuccess,
  props<{ authors: GenreAuthor[] }>()
);
export const loadGenreAuthorsFailureAction = createAction(
  GenreAuthorsActions.LoadGenreAuthorsFailure,
  props<{ errors: Errors }>()
);
