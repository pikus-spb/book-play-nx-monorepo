import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { CursorPositionService } from '../../services/player/cursor-position.service';
import { activeBookSelector } from '../books-cache/active-book.selectors';
import { audioCacheRecordSelector } from './audio-cache.selectors';

@Injectable({
  providedIn: 'root',
})
export class AudioCacheHelperService {
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private cursorService = inject(CursorPositionService);

  public getAudioPromise(idx?: number): Promise<string> {
    return firstValueFrom(
      this.store.select(audioCacheRecordSelector, {
        text: this.activeBook()!.textParagraphs[
          idx ?? this.cursorService.position
        ],
      })
    );
  }
}
