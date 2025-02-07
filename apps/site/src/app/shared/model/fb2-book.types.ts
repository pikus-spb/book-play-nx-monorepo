export interface BookData {
  author: Author;
  bookTitle: string;
  bookTitlePicture: string | null;
  paragraphs: string[];
}

export interface Author {
  first: string;
  middle?: string;
  last: string;
}
