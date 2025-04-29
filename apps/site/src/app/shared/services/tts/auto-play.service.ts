import { effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, fromEvent, Observable, shareReplay, tap } from 'rxjs';
import { activeBookSelector } from '../../store/active-book/active-book.selectors';
import {
  loadingEndAction,
  loadingStartAction,
} from '../../store/loading/loading.action';
import { VoiceAudioHelperService } from '../../store/voice-audio/voice-audio-helper.service';
import { DomAudioHelperService } from '../dom-audio-helper.service';
import { AppEventNames, EventsStateService } from '../events-state.service';
import { CursorPositionService } from '../player/cursor-position.service';
import { DomHelperService } from '../player/dom-helper.service';
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

  private router = inject(Router);
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private audioPlayer = inject(DomAudioHelperService);
  private eventStateService = inject(EventsStateService);
  private cursorService = inject(CursorPositionService);
  private domHelper = inject(DomHelperService);
  private preloadHelper = inject(AudioPreloadingService);
  private audioCacheHelperService = inject(VoiceAudioHelperService);

  constructor() {
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
      if (this.activeBook()) {
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
    if (!(await this.audioCacheHelperService.getAudioPromise())) {
      this.store.dispatch(loadingStartAction());

      await this.preloadHelper.preloadParagraph(
        this.cursorService.position,
        PRELOAD_EXTRA.min
      );

      this.store.dispatch(loadingEndAction());
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
    if (index >= 0) {
      this.cursorService.position = index;
    }
    this._paused$.next(false);
    this.store.dispatch(loadingEndAction());

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
        await this.audioCacheHelperService.getAudioPromise()
      );

      if (await this.audioPlayer.play()) {
        this.cursorService.position++;
      }
    } while (
      this.cursorService.position < this.activeBook()!.textParagraphs.length &&
      !this.audioPlayer.stopped
    );
  }
}
