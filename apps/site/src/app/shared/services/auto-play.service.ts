import { effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { VOICE_CACHE_PRELOAD_EXTRA } from '@book-play/constants';
import { Book } from '@book-play/models';
import {
  AppEventNames,
  CursorPositionService,
  DomAudioHelperService,
  DomHelperService,
  EventsStateService,
} from '@book-play/services';
import {
  activeBookSelector,
  loadingEndAction,
  loadingStartAction,
  VoiceAudioHelperService,
} from '@book-play/store';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilKeyChanged,
  filter,
  firstValueFrom,
  fromEvent,
  map,
  Observable,
  race,
  skip,
  tap,
  timer,
} from 'rxjs';
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
  private cursorPositionService = inject(CursorPositionService);
  private domHelper = inject(DomHelperService);
  private audioPreloadingService = inject(AudioPreloadingService);
  private audioCacheHelperService = inject(VoiceAudioHelperService);

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

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        tap(() => this.domHelper.showActiveParagraph()),
        takeUntilDestroyed()
      )
      .subscribe();

    fromEvent(window, 'focus')
      .pipe(
        debounceTime(200),
        tap(() => this.domHelper.showActiveParagraph()),
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
    if (
      !(await this.audioCacheHelperService.getAudio(
        this.cursorPositionService.position
      ))
    ) {
      this.store.dispatch(loadingStartAction());

      await this.audioPreloadingService.preloadParagraph(
        this.cursorPositionService.position,
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
      this.cursorPositionService.position = index;
    }
    this.store.dispatch(loadingEndAction());

    while (true) {
      await this.autoScrollingEnded();
      await this.ensureAudioDataReady();

      this.audioPlayer.setAudio(
        await this.audioCacheHelperService.getAudio(
          this.cursorPositionService.position
        )
      );

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
          timer(1000) // maximum time to wait for scroll ended
        ).pipe(map(() => true))
      );
    }
    return Promise.resolve(true);
  }

  private get bookLength(): number {
    return this.activeBook()!.textParagraphs.length;
  }
}
