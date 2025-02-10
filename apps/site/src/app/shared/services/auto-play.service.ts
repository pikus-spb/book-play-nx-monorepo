import { effect, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { ActiveBookService } from 'app/shared/services/active-book.service';
import { AudioStorageService } from 'app/shared/services/audio-storage.service';
import { CursorPositionLocalStorageService } from 'app/shared/services/cursor-position-local-storage.service';
import { DomAudioHelperService } from 'app/shared/services/dom-audio-helper.service';
import { DomHelperService } from 'app/shared/services/dom-helper.service';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';
import { TtsApiService } from 'app/shared/services/tts-api.service';
import {
  BehaviorSubject,
  filter,
  fromEvent,
  Observable,
  shareReplay,
  tap,
} from 'rxjs';
import {
  AudioPreloadingService,
  PRELOAD_EXTRA,
} from './audio-preloading.service';

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService {
  private _paused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  public paused$: Observable<boolean> = this._paused$.pipe(shareReplay(1));

  constructor(
    private router: Router,
    private activeBookService: ActiveBookService,
    private audioPlayer: DomAudioHelperService,
    private speechService: TtsApiService,
    private audioStorage: AudioStorageService,
    private eventStateService: EventsStateService,
    private preloadingService: AudioPreloadingService,
    private cursorService: CursorPositionLocalStorageService,
    private domHelper: DomHelperService,
    private preloadHelper: AudioPreloadingService
  ) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
        tap(async () => {
          if (!this.router.url.match('player')) {
            this.stop();
          }
        })
      )
      .subscribe();

    this.cursorService.position$
      .pipe(
        takeUntilDestroyed(),
        tap(async () => {
          this.domHelper.showActiveParagraph();
          this.preloadHelper.preloadParagraph(this.cursorService.position);
        })
      )
      .subscribe();

    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.domHelper.showActiveParagraph();
        })
      )
      .subscribe();

    effect(() => {
      if (this.activeBookService.book()) {
        this.stop();
        this.domHelper.showActiveParagraph();
      }
    });
  }

  private resume(): void {
    this.audioPlayer.play();
    this._paused$.next(false);
  }

  private pause(): void {
    this.audioPlayer.pause();
    this._paused$.next(true);
  }

  public async ensureAudioDataReady() {
    if (!this.audioStorage.get(this.cursorService.position)) {
      this.eventStateService.add(AppEventNames.loading);

      await this.preloadHelper.preloadParagraph(
        this.cursorService.position,
        PRELOAD_EXTRA.min
      );

      this.eventStateService.remove(AppEventNames.loading);
    }
  }

  public stop(): void {
    this.audioPlayer.stop();
    this._paused$.next(true);
  }

  public toggle(): void {
    if (this.audioPlayer.paused) {
      if (this.audioPlayer.stopped) {
        this.start();
      } else {
        this.resume();
      }
    } else {
      this.pause();
    }
  }

  public async start(index = -1) {
    if (this.preloadingService.initialized) {
      this.speechService.cancelAllVoiceRequests();
    }
    if (index >= 0) {
      this.cursorService.position = index;
    }
    this._paused$.next(false);
    this.eventStateService.remove(AppEventNames.loading, true);

    do {
      const isScrollingNow = this.eventStateService.get(
        AppEventNames.scrollingIntoView
      )();
      if (isScrollingNow) {
        await this.eventStateService.waitUntil(
          AppEventNames.scrollingIntoView,
          false
        );
      }

      await this.ensureAudioDataReady();

      this.audioPlayer.setAudio(
        this.audioStorage.get(this.cursorService.position)
      );

      if (await this.audioPlayer.play()) {
        this.cursorService.position++;
      }
    } while (
      this.activeBookService.cursorPositionIsValid() &&
      !this.audioPlayer.stopped
    );
  }
}
