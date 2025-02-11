export interface IndexedDBBookData {
  id: number;
  content: string;
}

export const INDEXED_DB_TABLE = {
  name: 'book',
  version: 1,
  columns: ['id', 'content'],
};
