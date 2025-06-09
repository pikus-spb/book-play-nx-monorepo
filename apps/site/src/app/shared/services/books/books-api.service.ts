import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BOOKS_API_PORT, BOOKS_API_PORT_SECURE } from '@book-play/constants';

import {
  Author,
  AuthorSummary,
  Book,
  DBAuthor,
  DBAuthorSummary,
  DBBook,
  DBBookToUIBook,
} from '@book-play/models';
import { getCurrentProtocolUrl } from '@book-play/utils-browser';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksApiService {
  private readonly apiUrlPrefix = getCurrentProtocolUrl(
    environment.API_HOST,
    BOOKS_API_PORT,
    BOOKS_API_PORT_SECURE
  );

  constructor(private http: HttpClient) {}

  public loadAllAuthors(): Observable<Author[]> {
    const url = this.apiUrlPrefix + '/author/all';

    return this.http.get<DBAuthor[]>(url).pipe(
      map((data: DBAuthor[]): Author[] => {
        return data.map((dbAuthor: DBAuthor) => {
          return new Author(dbAuthor);
        });
      })
    ) as Observable<Author[]>;
  }

  public loadRandomAuthors(
    number = environment.RANDOM_AUTHORS_COUNT
  ): Observable<AuthorSummary[]> {
    const url = this.apiUrlPrefix + `/author/random/${number}`;

    return this.http.get<DBAuthorSummary[]>(url).pipe(
      map((data: DBAuthorSummary[]): AuthorSummary[] => {
        return data.map((dbAuthor: DBAuthorSummary) => {
          return new AuthorSummary(dbAuthor);
        });
      })
    ) as Observable<AuthorSummary[]>;
  }

  public loadRandomBookIds(
    number = environment.RANDOM_BOOKS_COUNT
  ): Observable<string[]> {
    const url = this.apiUrlPrefix + `/book/random-id/${number}`;
    return this.http.get<string[]>(url);
  }

  public loadAuthorBooks(id: string): Observable<Book[]> {
    const url = this.apiUrlPrefix + `/author/id/${id}/books`;

    return this.http.get<DBBook[]>(url).pipe(
      map((data: DBBook[]): Book[] => {
        return data.map((book: DBBook) => {
          return new Book({
            id: book.id,
            name: book.name,
          });
        });
      })
    ) as Observable<Book[]>;
  }

  public loadAuthorSummary(authorId: string): Observable<AuthorSummary> {
    const url = this.apiUrlPrefix + `/author/id/${authorId}/summary`;

    return this.http
      .get<DBAuthorSummary>(url)
      .pipe(
        map(
          (authorSummary: DBAuthorSummary) => new AuthorSummary(authorSummary)
        )
      );
  }

  public loadBookById(id: string): Observable<Book> {
    const url = this.apiUrlPrefix + '/book/id/' + id;

    return this.http.get<DBBook>(url).pipe(
      map((book: DBBook) => {
        return DBBookToUIBook(book);
      })
    );
  }

  public loadBookSummaryById(id: string): Observable<Book> {
    const url = this.apiUrlPrefix + `/book/id/${id}/summary`;

    return this.http.get<DBBook>(url).pipe(
      map((book: DBBook) => {
        return DBBookToUIBook(book);
      })
    );
  }
}
