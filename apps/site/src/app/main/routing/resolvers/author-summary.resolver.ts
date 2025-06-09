import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AuthorSummary } from '@book-play/models';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { loadAuthorSummaryAction } from '../../../shared/store/author-summary/author-summary.actions';
import { authorSummarySelector } from '../../../shared/store/author-summary/author-summary.selectors';

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
