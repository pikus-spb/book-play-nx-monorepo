import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { TtsApiService } from '@book-play/services';
import { loadingEndAction, loadingStartAction } from '@book-play/store';
import { blobToBase64 } from '@book-play/utils-browser';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  distinctUntilChanged,
  firstValueFrom,
  fromEvent,
  map,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'voice',
  imports: [MatButton, AsyncPipe],
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VoiceComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('input') input!: ElementRef;

  public text = '';
  public valid$: Subject<boolean> = new BehaviorSubject(false);
  private store = inject(Store);
  private speechService = inject(TtsApiService);
  private destroyRef = inject(DestroyRef);

  private addAudioElement(base64Data: string, text: string): void {
    const audio = document.createElement('audio');
    audio.setAttribute('controls', 'true');
    audio.setAttribute('autoplay', 'true');
    audio.setAttribute('class', 'preview');
    audio.src = base64Data;

    const textNode = document.createElement('span');
    textNode.innerText = text;

    this.container.nativeElement.appendChild(textNode);
    this.container.nativeElement.appendChild(audio);
  }

  async voice() {
    this.store.dispatch(loadingStartAction());

    const data = await firstValueFrom(
      this.speechService.textToSpeech(this.text).pipe(
        switchMap((blob: Blob) => {
          return blobToBase64(blob);
        })
      )
    );
    this.addAudioElement(data, this.text);

    this.store.dispatch(loadingEndAction());
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.input.nativeElement, 'input')
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        distinctUntilChanged(),
        tap((value: string) => {
          value = value.trim();
          this.text = value;
          this.valid$.next(value.length > 0);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
