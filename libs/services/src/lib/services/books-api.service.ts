import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BOOKS_API_URL, HTTP_RETRY_NUMBER } from '@book-play/constants';

import { AuthorsBooks, BookContents, BookDescription } from '@book-play/models';
import { firstValueFrom, Observable, retry, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksApiService {
  private requestCache: Map<string, Observable<unknown>> = new Map();

  constructor(private http: HttpClient) {}

  public getAllGroupedByAuthor(): Promise<AuthorsBooks> {
    const url = '/book/all/grouped-by-author';

    return this.fromCache<AuthorsBooks>(
      url,
      this.http.get<AuthorsBooks>(BOOKS_API_URL + url)
    );
  }

  public getById(id: string): Promise<BookContents> {
    const url = '/book/' + id;

    return this.fromCache<BookContents>(
      url,
      this.http.get<BookContents>(BOOKS_API_URL + url)
    );
  }

  public searchByKeyWord(key: string): Promise<BookDescription[]> {
    const url = '/book/name/like/' + key;

    return this.fromCache<BookDescription[]>(
      url,
      this.http.get<BookDescription[]>(BOOKS_API_URL + url)
    );
  }

  private fromCache<T>(url: string, observable: Observable<T>): Promise<T> {
    this.putToRequestCache<T>(url, observable);
    return this.getFromRequestCache<T>(url);
  }

  private putToRequestCache<T>(url: string, observable: Observable<T>) {
    if (this.requestCache.get(url) === undefined) {
      this.requestCache.set(
        url,
        observable.pipe(
          retry(HTTP_RETRY_NUMBER),
          shareReplay(1)
        ) as Observable<T>
      );
    }
  }

  private getFromRequestCache<T>(url: string): Promise<T> {
    return firstValueFrom<T>(this.requestCache.get(url) as Observable<T>);
  }
}
