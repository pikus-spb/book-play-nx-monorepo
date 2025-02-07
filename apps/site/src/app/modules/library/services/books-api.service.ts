import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, retry, shareReplay } from 'rxjs';

import {
  AuthorsBooks,
  BookContents,
  BookDescription,
} from '../model/books-model';

const protocol = document.location.protocol;
const port = protocol === 'https:' ? 8443 : 8282;
const API_URL = protocol + '//192.168.31.200:' + port;
const RETRY_NUMBER = 3;

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
      this.http.get<AuthorsBooks>(API_URL + url)
    );
  }

  public getById(id: string): Promise<BookContents> {
    const url = '/book/' + id;

    return this.fromCache<BookContents>(
      url,
      this.http.get<BookContents>(API_URL + url)
    );
  }

  public searchByKeyWord(key: string): Promise<BookDescription[]> {
    const url = '/book/name/like/' + key;

    return this.fromCache<BookDescription[]>(
      url,
      this.http.get<BookDescription[]>(API_URL + url)
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
        observable.pipe(retry(RETRY_NUMBER), shareReplay(1)) as Observable<T>
      );
    }
  }

  private getFromRequestCache<T>(url: string): Promise<T> {
    return firstValueFrom<T>(this.requestCache.get(url) as Observable<T>);
  }
}
