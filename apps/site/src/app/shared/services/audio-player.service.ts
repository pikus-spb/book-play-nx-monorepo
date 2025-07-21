import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService implements OnDestroy {
  private audio!: HTMLAudioElement;

  constructor() {
    this.createElements();
  }

  public setAudio(base64Data: string): void {
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.audio.src = base64Data;
    this.audio.load();
  }

  public play(): HTMLAudioElement {
    this.audio.play();
    return this.audio;
  }

  public pause() {
    this.audio.pause();
  }

  public ngOnDestroy() {
    if (this.audio) {
      document.removeChild(this.audio);
    }
  }

  private createElements(): void {
    this.audio = document.createElement('audio');
    this.audio.setAttribute('hidden', 'true');
    document.body.appendChild(this.audio);
  }
}
