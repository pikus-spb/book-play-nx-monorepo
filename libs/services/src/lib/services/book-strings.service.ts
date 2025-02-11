import { Injectable } from '@angular/core';
import { BookData, BookDescription } from '@book-play/models';

@Injectable({
  providedIn: 'root',
})
export class BookStringsService {
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
