import { Injectable } from '@angular/core';
import { INDEXED_DB_TABLE, IndexedDBBookData } from '@book-play/models';
import { Dexie, Table } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbBookStorageService extends Dexie {
  private dbTable!: Table<any, number>;

  constructor() {
    super(INDEXED_DB_TABLE.name);
    this.version(INDEXED_DB_TABLE.version).stores({
      dbTable: INDEXED_DB_TABLE.columns.join(','),
    });
  }

  get(): Promise<IndexedDBBookData> {
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
