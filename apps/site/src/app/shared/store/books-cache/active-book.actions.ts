import { Book, Errors } from '@book-play/models';
import { createAction, props } from '@ngrx/store';

export enum ActiveBookActions {
  ActiveBookImportFromPersistenceStorage = '[Active book] book import from browser storage',
  ActiveBookImportFromFile = '[Active book] book import from file',
  ActiveBookLoadById = '[Active book] book load by id',
  ActiveBookLoadSuccess = '[Active book] book load success',
  ActiveBookLoadFailure = '[Active book] book load failure',
}

export const activeBookLoadByIdAction = createAction(
  ActiveBookActions.ActiveBookLoadById,
  props<{ id: string }>()
);
export const activeBookImportFromPersistenceStorageAction = createAction(
  ActiveBookActions.ActiveBookImportFromPersistenceStorage
);
export const activeBookImportFromFileAction = createAction(
  ActiveBookActions.ActiveBookImportFromFile,
  props<{ file: File }>()
);
export const activeBookSuccessAction = createAction(
  ActiveBookActions.ActiveBookLoadSuccess,
  props<{ book: Book }>()
);
export const activeBookFailureAction = createAction(
  ActiveBookActions.ActiveBookLoadFailure,
  props<{ errors: Errors }>()
);
