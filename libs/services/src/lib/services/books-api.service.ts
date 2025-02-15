import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BOOKS_API_URL, HTTP_RETRY_NUMBER } from '@book-play/constants';

import { AuthorBooks, Book, DBAuthorBooks, DBBook } from '@book-play/models';
import { DBBookToUIBook } from '@book-play/utils';
import { firstValueFrom, map, Observable, retry, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksApiService {
  private requestCache: Map<string, Observable<unknown>> = new Map();

  constructor(private http: HttpClient) {}

  public getAllGroupedByAuthor(): Promise<AuthorBooks> {
    const url = '/book/all/grouped-by-author';

    return this.fromCache<AuthorBooks>(
      url,
      this.http.get<DBAuthorBooks>(BOOKS_API_URL + url).pipe(
        map((data: DBAuthorBooks): AuthorBooks => {
          const result = {} as AuthorBooks;
          Object.keys(data).forEach((authorName) => {
            result[authorName] = data[authorName].map(
              (book: DBBook): Book => DBBookToUIBook(book)
            );
          });
          return result;
        })
      ) as Observable<AuthorBooks>
    );
  }

  public getById(id: string): Promise<Book> {
    const url = '/book/' + id;

    return this.fromCache<Book>(
      url,
      this.http.get<DBBook>(BOOKS_API_URL + url).pipe(
        map((book: DBBook) => {
          return DBBookToUIBook(book);
        })
      )
    );
  }

  public search(key: string): Promise<Book[]> {
    const url = '/book/all/search/' + key;

    return this.fromCache<Book[]>(
      url,
      this.http.get<DBBook[]>(BOOKS_API_URL + url).pipe(
        map((books: DBBook[]): Book[] => {
          return books.map((book) => DBBookToUIBook(book));
        })
      )
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
