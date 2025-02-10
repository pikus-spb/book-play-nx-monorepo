import { effect, Injectable } from '@angular/core';
import { ActiveBookService } from 'app/modules/player/services/active-book.service';

@Injectable({
  providedIn: 'root',
})
export class AudioStorageService {
  private storage: Map<number, string> = new Map<number, string>();
  private previousBookTitle = '';

  constructor(private bookService: ActiveBookService) {
    effect(() => {
      const title = this.bookService.book()?.bookTitle || '';
      if (title !== this.previousBookTitle) {
        this.previousBookTitle = title;
        this.clear();
      }
    });
  }

  private clear(): void {
    this.storage.clear();
  }

  public set(index: number, data: string): void {
    this.storage.set(index, data);
  }

  public get(index: number): string {
    return this.storage.get(index) ?? '';
  }
}
