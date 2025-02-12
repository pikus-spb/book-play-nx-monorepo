import { BookData, BookDescription } from '@book-play/models';

export function getBookFullDisplayName(book: BookData): string {
  return `${book.author.first} ${book.author.last} - ${book.bookTitle}`;
}

export function getAuthorFullName(book: BookDescription): string {
  return `${book.authorFirstName} ${book.authorLastName}`;
}

export function getBookHashKey(book: BookData): string {
  return `${book.author.first}${book.author.middle}${book.author.last}${book.bookTitle}${book.paragraphs.length}`;
}
