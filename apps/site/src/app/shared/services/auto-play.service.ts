import { effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import {
  AppEventNames,
  CursorPositionService,
  DomAudioHelperService,
  DomHelperService,
  EventsStateService,
  LoadingService,
} from '@book-play/services';
import {
  debounceTime,
  firstValueFrom,
  fromEvent,
  map,
  merge,
  Observable,
  race,
  tap,
} from 'rxjs';
import { ActiveBookService } from './active-book.service';
import { AudioPreloadingService } from './audio-preloading.service';
import { VoiceAudioService } from './voice-audio.service';

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService {
  private activeBook = inject(ActiveBookService).book;
  private loading = inject(LoadingService);
  private audioPlayer = inject(DomAudioHelperService);
  private eventStateService = inject(EventsStateService);
  private cursorPositionService = inject(CursorPositionService);
  private domHelper = inject(DomHelperService);
  private audioPreloadingService = inject(AudioPreloadingService);
  private voiceAudio = inject(VoiceAudioService);
  private previousBookHash?: string;

  constructor() {
    this.cursorPositionService.position$
      .pipe(
        tap(() => {
          this.domHelper.showActiveParagraph();
          this.audioPreloadingService.preloadParagraph(
            this.cursorPositionService.position
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    merge(fromEvent(window, 'resize'), fromEvent(window, 'focus'))
      .pipe(
        debounceTime(200),
        tap(() => this.domHelper.showActiveParagraph()),
        takeUntilDestroyed()
      )
      .subscribe();

    effect(() => {
      const book = this.activeBook();
      if (book && this.previousBookHash && this.previousBookHash !== book.hash) {
        this.stop();
        this.domHelper.showActiveParagraph();
      }
      this.previousBookHash = book?.hash;
    });
  }

  public async ensureAudioDataReady() {
    const text =
      this.activeBook()?.textParagraphs[this.cursorPositionService.position];
    if (!text || this.voiceAudio.getCached(text)) {
      return;
    }

    this.loading.start();
    try {
      await this.audioPreloadingService.preloadParagraph(
        this.cursorPositionService.position,
        VOICE_CACHE_PRELOAD_EXTRA.min
      );
    } finally {
      this.loading.end();
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
      this.cursorPositionService.position = index;
    }

    while (true) {
      await this.autoScrollingEnded();
      await this.ensureAudioDataReady();

      const text =
        this.activeBook()!.textParagraphs[this.cursorPositionService.position];
      this.audioPlayer.setAudio(this.voiceAudio.getCached(text));

      await this.audioPlayer.play();

      if (
        !this.audioPlayer.stopped &&
        this.cursorPositionService.position + 1 < this.bookLength
      ) {
        this.cursorPositionService.position++;
      } else {
        break;
      }
    }
  }

  private autoScrollingEnded(): Promise<boolean> {
    // Don't care about scrolling while window is inactive
    if (!document.hasFocus()) {
      return Promise.resolve(true);
    }

    const isScrollingNow = this.eventStateService.get(
      AppEventNames.scrollingIntoView
    )();
    if (isScrollingNow) {
      return firstValueFrom(
        race(
          this.eventStateService.waitUntilObservable(
            AppEventNames.scrollingIntoView,
            false
          ),
          fromEvent(window, 'blur')
        ).pipe(map(() => true))
      );
    }
    return Promise.resolve(true);
  }

  private get bookLength(): number {
    return this.activeBook()!.textParagraphs.length;
  }
}
