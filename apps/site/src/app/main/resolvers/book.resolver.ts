import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Book } from '@book-play/models';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';

import { loadBookSummaryAction } from '../../shared/store/book-summary/book-summary.actions';
import { bookSummarySelector } from '../../shared/store/book-summary/book-summary.selectors';

@Injectable({
  providedIn: 'root',
})
export class BookResolver implements Resolve<Book> {
  private store = inject(Store);

  resolve(route: ActivatedRouteSnapshot): Observable<Book> {
    this.store.dispatch(
      loadBookSummaryAction({ bookId: route.params?.['id'] })
    );
    return this.store
      .select(bookSummarySelector)
      .pipe(filter((data) => data !== null)) as Observable<Book>;
  }
}
