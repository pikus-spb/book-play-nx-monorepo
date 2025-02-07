import { Injectable, OnDestroy } from '@angular/core';
import { firstValueFrom, fromEvent, merge, Subject } from 'rxjs';
import { EqualizerService } from './equalizer.service';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService implements OnDestroy {
  private audio!: HTMLAudioElement;
  private destroyed$: Subject<void> = new Subject<void>();
  private _ended$: Subject<boolean> = new Subject<boolean>();
  private _stopped = true;

  public get paused(): boolean {
    return this.audio.paused;
  }

  public get stopped(): boolean {
    return this._stopped;
  }

  constructor(private equalizer: EqualizerService) {
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
    const reallyEnded$ = fromEvent(this.audio, 'ended');

    if (!this.equalizer.applied) {
      this.equalizer.equalize(this.audio);
    }

    await this.audio.play();
    this._stopped = false;
    return await firstValueFrom(merge(this._ended$, reallyEnded$));
  }

  public stop() {
    this.audio.pause();
    this._ended$.next(false);
    this._stopped = true;
  }

  public pause(): void {
    this.audio.pause();
  }

  ngOnDestroy() {
    if (this.audio) {
      document.removeChild(this.audio);
    }
    this.destroyed$.next();
  }
}
