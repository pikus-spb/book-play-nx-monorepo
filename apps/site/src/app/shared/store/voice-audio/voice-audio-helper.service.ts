import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { CursorPositionService } from '../../services/player/cursor-position.service';
import { activeBookSelector } from '../active-book/active-book.selectors';
import { voiceAudioRecordSelector } from './voice-audio.selectors';

@Injectable({
  providedIn: 'root',
})
export class VoiceAudioHelperService {
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private cursorService = inject(CursorPositionService);

  public getAudio(idx?: number): Promise<string> {
    return firstValueFrom(
      this.store.select(voiceAudioRecordSelector, {
        text: this.activeBook()!.textParagraphs[
          idx ?? this.cursorService.position
        ],
      })
    );
  }
}
