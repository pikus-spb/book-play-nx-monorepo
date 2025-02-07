import { Injectable } from '@angular/core';
import { Dexie, Table } from 'dexie';

export interface DBBookData {
  id: number;
  content: string;
}

const DB_TABLE = {
  name: 'book',
  version: 1,
  columns: ['id', 'content'],
};

@Injectable({
  providedIn: 'root',
})
export class IndexedDbStorageService extends Dexie {
  private dbTable!: Table<any, number>;

  constructor() {
    super(DB_TABLE.name);
    this.version(DB_TABLE.version).stores({
      dbTable: DB_TABLE.columns.join(','),
    });
  }

  get(): Promise<DBBookData> {
    return this.dbTable.where({ id: 1 }).first();
  }

  set(content: string): Promise<number> {
    this.dbTable.clear();

    return this.dbTable.add({
      id: 1,
      content,
    }) as Promise<number>;
  }
}
