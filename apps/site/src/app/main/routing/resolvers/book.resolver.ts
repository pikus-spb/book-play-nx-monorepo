import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Book } from '@book-play/models';
import {
  activeBookImportFromPersistenceStorageAction,
  activeBookLoadByIdAction,
  activeBookSelector,
} from '@book-play/store';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookResolver implements Resolve<Book> {
  private store = inject(Store);

  resolve(route: ActivatedRouteSnapshot): Observable<Book> {
    const id = route.params?.['id'];

    if (id) {
      this.store.dispatch(activeBookLoadByIdAction({ id }));
    } else {
      this.store.dispatch(activeBookImportFromPersistenceStorageAction());
    }

    return this.store
      .select(activeBookSelector)
      .pipe(filter((book) => book !== null && book !== undefined));
  }
}
