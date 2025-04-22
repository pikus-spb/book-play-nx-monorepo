import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { ActiveBookService } from '../../services/books/active-book.service';
import { CursorPositionService } from '../../services/player/cursor-position.service';
import { audioCacheRecordSelector } from './audio-cache.selectors';

@Injectable({
  providedIn: 'root',
})
export class AudioCacheHelperService {
  private store = inject(Store);
  private activeBookService = inject(ActiveBookService);
  private cursorService = inject(CursorPositionService);

  public getAudioPromise(idx?: number): Promise<string> {
    return firstValueFrom(
      this.store.select(audioCacheRecordSelector, {
        text: this.activeBookService.book()!.textParagraphs[
          idx ?? this.cursorService.position
        ],
      })
    );
  }
}
