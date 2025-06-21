import { effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import { Book } from '@book-play/models';
import { Store } from '@ngrx/store';
import {
  distinctUntilKeyChanged,
  filter,
  fromEvent,
  Observable,
  skip,
  tap,
} from 'rxjs';
import { activeBookSelector } from '../../store/active-book/active-book.selectors';
import {
  loadingEndAction,
  loadingStartAction,
} from '../../store/loading/loading.action';
import { VoiceAudioHelperService } from '../../store/voice-audio/voice-audio-helpers';
import { DomAudioHelperService } from '../dom-audio-helper.service';
import { AppEventNames, EventsStateService } from '../events-state.service';
import { CursorPositionService } from '../player/cursor-position.service';
import { DomHelperService } from '../player/dom-helper.service';
import { AudioPreloadingService } from './audio-preloading.service';

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService {
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private activeBookChanged = toSignal(
    this.store.select(activeBookSelector).pipe(
      filter((value) => value !== null),
      distinctUntilKeyChanged<Book>('hash'),
      skip(1)
    )
  );
  private audioPlayer = inject(DomAudioHelperService);
  private eventStateService = inject(EventsStateService);
  private cursorService = inject(CursorPositionService);
  private domHelper = inject(DomHelperService);
  private preloadHelper = inject(AudioPreloadingService);
  private audioCacheHelperService = inject(VoiceAudioHelperService);

  constructor() {
    this.cursorService.position$
      .pipe(
        tap(() => {
          this.domHelper.showActiveParagraph();
          this.preloadHelper.preloadParagraph(this.cursorService.position);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    fromEvent(window, 'resize')
      .pipe(
        tap(() => {
          this.domHelper.showActiveParagraph();
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    effect(() => {
      if (this.activeBookChanged()) {
        this.stop();
        this.domHelper.showActiveParagraph();
      }
    });
  }

  public async ensureAudioDataReady() {
    if (!(await this.audioCacheHelperService.getAudio())) {
      this.store.dispatch(loadingStartAction());

      await this.preloadHelper.preloadParagraph(
        this.cursorService.position,
        VOICE_CACHE_PRELOAD_EXTRA.min
      );

      this.store.dispatch(loadingEndAction());
    }
  }

  public stop(): void {
    this.audioPlayer.stop();
  }

  public get stopped$(): Observable<boolean> {
    return this.audioPlayer.stopped$;
  }

  public toggle(): void {
    if (this.audioPlayer.stopped) {
      this.start();
    } else {
      this.stop();
    }
  }

  public async start(index = -1) {
    if (index >= 0 && index < this.bookLength) {
      this.cursorService.position = index;
    }
    this.store.dispatch(loadingEndAction());

    while (true) {
      await this.autoScrollingEnd();
      await this.ensureAudioDataReady();

      this.audioPlayer.setAudio(await this.audioCacheHelperService.getAudio());

      await this.audioPlayer.play();

      if (
        !this.audioPlayer.stopped &&
        this.cursorService.position + 1 < this.bookLength
      ) {
        this.cursorService.position++;
      } else {
        break;
      }
    }
  }

  private autoScrollingEnd(): Promise<void> {
    const isScrollingNow = this.eventStateService.get(
      AppEventNames.scrollingIntoView
    )();
    if (isScrollingNow) {
      return this.eventStateService.waitUntil(
        AppEventNames.scrollingIntoView,
        false
      );
    }
    return Promise.resolve();
  }

  private get bookLength(): number {
    return this.activeBook()!.textParagraphs.length;
  }
}
