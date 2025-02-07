import { Injectable } from '@angular/core';
import { BookDescription } from 'app/modules/library/model/books-model';
import { BookData } from 'app/shared/model/fb2-book.types';

@Injectable({
  providedIn: 'root',
})
export class BookUtilsService {
  public getBookFullDisplayName(book: BookData): string {
    return `${book.author.first} ${book.author.last} - ${book.bookTitle}`;
  }

  public getAuthorFullName(book: BookDescription): string {
    return `${book.authorFirstName} ${book.authorLastName}`;
  }

  public getBookHashKey(book: BookData): string {
    return `${book.author.first}${book.author.middle}${book.author.last}${book.bookTitle}${book.paragraphs.length}`;
  }
}
