import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  Signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Base64Data } from '@book-play/models';
import { firstValueFrom, fromEvent, take } from 'rxjs';

@Component({
  selector: 'lib-book-play',
  imports: [],
  templateUrl: './book-play.component.html',
  styleUrl: './book-play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPlayComponent {
  public base64Data: InputSignal<Base64Data> = input.required<Base64Data>();
  private destroyRef = inject(DestroyRef);
  private audioRef: Signal<ElementRef<HTMLAudioElement> | undefined> =
    viewChild('audio');
  private get audio(): HTMLAudioElement | undefined {
    return this.audioRef()?.nativeElement;
  }

  constructor() {
    effect(() => {
      const data = this.base64Data();
      if (data.length > 0) {
        this.audio?.load();
      }
    });
  }

  public async play(): Promise<Event> {
    if (this.audio) {
      const audioEnded = fromEvent(this.audio, 'ended').pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      );

      await this.audio.play();

      return await firstValueFrom(audioEnded);
    } else {
      return Promise.reject('Book play service audio element is not ready');
    }
  }

  public pause() {
    this.audio?.pause();
  }
}
