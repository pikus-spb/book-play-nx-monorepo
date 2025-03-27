import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  API_HOST,
  BOOKS_API_PORT,
  BOOKS_API_PORT_SECURE,
  HTTP_RETRY_NUMBER,
} from '@book-play/constants';

import {
  Author,
  AuthorByGenre,
  AuthorSummary,
  Book,
  DBAuthor,
  DBAuthorByGenre,
  DBAuthorByGenreToUI,
  DBAuthorSummary,
  DBBook,
  DBBookToUIBook,
} from '@book-play/models';
import { getCurrentProtocolUrl } from '@book-play/ui';
import { firstValueFrom, map, Observable, retry, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksApiService {
  private requestCache: Map<string, Observable<unknown>> = new Map();
  private readonly apiUrlPrefix = getCurrentProtocolUrl(
    API_HOST,
    BOOKS_API_PORT.toString(),
    BOOKS_API_PORT_SECURE.toString()
  );

  constructor(private http: HttpClient) {}

  public getAllAuthors(): Promise<Author[]> {
    const url = this.apiUrlPrefix + '/author/all';

    return this.fromCache<Author[]>(
      url,
      this.http.get<DBAuthor[]>(url).pipe(
        map((data: DBAuthor[]): Author[] => {
          return data.map((dbAuthor: DBAuthor) => {
            return new Author(dbAuthor);
          });
        })
      ) as Observable<Author[]>
    );
  }

  public getRandomAuthors(number = 3): Promise<Author[]> {
    const url = this.apiUrlPrefix + `/author/random/${number}`;

    return this.fromCache<Author[]>(
      url,
      this.http.get<DBAuthor[]>(url).pipe(
        map((data: DBAuthor[]): Author[] => {
          return data.map((dbAuthor: DBAuthor) => {
            return new Author(dbAuthor);
          });
        })
      ) as Observable<Author[]>
    );
  }

  public getRandomIds(number = 3): Promise<string[]> {
    const url = this.apiUrlPrefix + `/book/random-id/${number}`;

    return this.fromCache<string[]>(url, this.http.get<string[]>(url));
  }

  public getAuthorBooks(id: string): Promise<Book[]> {
    const url = this.apiUrlPrefix + `/author/id/${id}/books`;

    return this.fromCache<Book[]>(
      url,
      this.http.get<DBBook[]>(url).pipe(
        map((data: DBBook[]): Book[] => {
          return data.map((book: DBBook) => {
            return new Book({
              id: book.id,
              name: book.name,
            });
          });
        })
      ) as Observable<Book[]>
    );
  }

  public getAuthorSummary(id: string): Promise<AuthorSummary> {
    const url = this.apiUrlPrefix + `/author/id/${id}/summary`;

    return this.fromCache<AuthorSummary>(
      url,
      this.http
        .get<DBAuthorSummary>(url)
        .pipe(
          map(
            (authorSummary: DBAuthorSummary) => new AuthorSummary(authorSummary)
          )
        )
    );
  }

  public getAuthorsByGenre(genre: string): Promise<AuthorByGenre[]> {
    const url = this.apiUrlPrefix + `/author/genre/${genre}`;

    return this.fromCache<AuthorByGenre[]>(
      url,
      this.http.get<DBAuthorByGenre[]>(url).pipe(
        map((authors: DBAuthorByGenre[]): AuthorByGenre[] => {
          return authors.map((author) => DBAuthorByGenreToUI(author));
        })
      )
    );
  }

  public getBookById(id: string): Promise<Book> {
    const url = this.apiUrlPrefix + '/book/id/' + id;

    return this.fromCache<Book>(
      url,
      this.http.get<DBBook>(url).pipe(
        map((book: DBBook) => {
          return DBBookToUIBook(book);
        })
      )
    );
  }

  public getBookSummaryById(id: string): Promise<Book> {
    const url = this.apiUrlPrefix + `/book/id/${id}/summary`;

    return this.fromCache<Book>(
      url,
      this.http.get<DBBook>(url).pipe(
        map((book: DBBook) => {
          return DBBookToUIBook(book);
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
