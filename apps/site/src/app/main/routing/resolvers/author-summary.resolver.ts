import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AuthorSummary } from '@book-play/models';
import { BooksApiService, LoadingService } from '@book-play/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorSummaryResolver implements Resolve<AuthorSummary> {
  private booksApiService = inject(BooksApiService);
  private loading = inject(LoadingService);

  resolve(route: ActivatedRouteSnapshot): Observable<AuthorSummary> {
    return this.loading.track(
      this.booksApiService.loadAuthorSummary(route.params?.['id'])
    );
  }
}
