import { Book } from '@book-play/models';
import { containsLetters } from '@book-play/utils-common';

export function checkBookDataIsValid(book: Book): boolean {
  return (
    [book.name, book.author.first, book.author.last].every((item) =>
      containsLetters(item)
    ) && book.paragraphs.length > 0
  );
}
