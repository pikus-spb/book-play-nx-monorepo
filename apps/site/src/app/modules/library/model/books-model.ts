export interface BookDescription {
  id: number;
  authorFirstName: string;
  authorLastName: string;
  title: string;
  bookFullName: string;
  logo?: string;
}
export type AuthorsBooks = Record<string, BookDescription[]>;

export interface BookContents {
  bookFullName: string;
  content: string;
}
