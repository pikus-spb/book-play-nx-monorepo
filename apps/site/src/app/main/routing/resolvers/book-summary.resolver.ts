import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Book } from '@book-play/models';
import { BooksApiService, LoadingService } from '@book-play/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookSummaryResolver implements Resolve<Book> {
  private booksApiService = inject(BooksApiService);
  private loading = inject(LoadingService);

  resolve(route: ActivatedRouteSnapshot): Observable<Book> {
    return this.loading.track(
      this.booksApiService.loadBookSummaryById(route.params?.['id'])
    );
  }
}
