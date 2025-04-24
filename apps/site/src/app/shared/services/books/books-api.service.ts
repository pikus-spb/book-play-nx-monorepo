import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BOOKS_API_PORT, BOOKS_API_PORT_SECURE } from '@book-play/constants';

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
import { environment } from 'environments/environment';
import { firstValueFrom, map, Observable } from 'rxjs';

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

  public getAllAuthors(): Promise<Author[]> {
    const url = this.apiUrlPrefix + '/author/all';

    return firstValueFrom(
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

    return firstValueFrom(
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

    return firstValueFrom(this.http.get<string[]>(url));
  }

  public getAuthorBooks(id: string): Promise<Book[]> {
    const url = this.apiUrlPrefix + `/author/id/${id}/books`;

    return firstValueFrom(
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

    return firstValueFrom(
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

    return firstValueFrom(
      this.http.get<DBAuthorByGenre[]>(url).pipe(
        map((authors: DBAuthorByGenre[]): AuthorByGenre[] => {
          return authors.map((author) => DBAuthorByGenreToUI(author));
        })
      )
    );
  }

  public getBookById(id: string): Observable<Book> {
    const url = this.apiUrlPrefix + '/book/id/' + id;

    return this.http.get<DBBook>(url).pipe(
      map((book: DBBook) => {
        return DBBookToUIBook(book);
      })
    );
  }

  public getBookSummaryById(id: string): Promise<Book> {
    const url = this.apiUrlPrefix + `/book/id/${id}/summary`;

    return firstValueFrom(
      this.http.get<DBBook>(url).pipe(
        map((book: DBBook) => {
          return DBBookToUIBook(book);
        })
      )
    );
  }
}
