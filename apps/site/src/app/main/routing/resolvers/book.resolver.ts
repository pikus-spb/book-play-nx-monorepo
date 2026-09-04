import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Book } from '@book-play/models';
import { Observable } from 'rxjs';
import { ActiveBookService } from '../../../shared/services/active-book.service';

@Injectable({
  providedIn: 'root',
})
export class BookResolver implements Resolve<Book> {
  private activeBook = inject(ActiveBookService);

  resolve(route: ActivatedRouteSnapshot): Observable<Book> | Promise<Book> {
    const id = route.params?.['id'];

    if (id) {
      return this.activeBook.loadById(id);
    }

    return this.activeBook.loadFromStorage();
  }
}
