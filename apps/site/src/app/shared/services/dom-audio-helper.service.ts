import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  fromEvent,
  merge,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomAudioHelperService implements OnDestroy {
  private audio!: HTMLAudioElement;
  private destroyed$ = new Subject<void>();
  public stopped$ = new BehaviorSubject<boolean>(true);

  public get stopped(): boolean {
    return this.stopped$.value;
  }

  constructor() {
    this.createAudioElement();
  }

  private createAudioElement(): void {
    this.audio = document.createElement('audio');
    this.audio.setAttribute('hidden', 'true');
    document.body.appendChild(this.audio);
  }

  public setAudio(base64Data: string): void {
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.audio.src = base64Data;
    this.audio.load();
  }

  public async play(): Promise<boolean | Event> {
    const voiceAudioEnded = fromEvent(this.audio, 'ended').pipe(
      take(1),
      takeUntil(this.destroyed$)
    );

    await this.audio.play();

    this.stopped$.next(false);

    return await firstValueFrom(
      merge(this.stopped$.pipe(filter((value) => value)), voiceAudioEnded)
    );
  }

  public stop() {
    this.audio.pause();
    this.stopped$.next(true);
  }

  ngOnDestroy() {
    if (this.audio) {
      document.removeChild(this.audio);
    }
    this.destroyed$.next();
  }
}
