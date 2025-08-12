import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AuthorSummary } from '@book-play/models';
import {
  authorSummarySelector,
  loadAuthorSummaryAction,
} from '@book-play/store';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorSummaryResolver implements Resolve<AuthorSummary> {
  private store = inject(Store);

  resolve(route: ActivatedRouteSnapshot): Observable<AuthorSummary> {
    this.store.dispatch(
      loadAuthorSummaryAction({ authorId: route.params?.['id'] })
    );
    return this.store
      .select(authorSummarySelector)
      .pipe(filter((author) => author !== null)) as Observable<AuthorSummary>;
  }
}
