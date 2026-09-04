import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import {
  DEFAULT_COUNTDOWN_TIMER_VALUE,
  environment,
  SETTINGS_VOICE_PITCH_DELTA,
  SETTINGS_VOICE_RATE_DELTA,
  UNBLOCK_CONTENT_COOKIE_NAME,
} from '@book-play/constants';
import { Voices } from '@book-play/models';
import { settingsSelector, settingsUpdateAction } from '@book-play/store';
import { ColorPickerComponent, ColorPickerGroupComponent } from '@book-play/ui';
import { getCookie } from '@book-play/utils-browser';
import {
  secondsToTimeString,
  timeStringToSeconds,
} from '@book-play/utils-common';
import { Store } from '@ngrx/store';
import { NgxMatTimepickerFieldComponent } from 'ngx-mat-timepicker';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSlider,
    MatSliderThumb,
    NgxMatTimepickerFieldComponent,
    ColorPickerComponent,
    ColorPickerGroupComponent,
    CommonModule
],
})
export class SettingsComponent {
  protected form!: FormGroup;

  private fb = inject(FormBuilder);
  private store = inject(Store);
  protected settings = this.store.selectSignal(settingsSelector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.initializeValues();
    this.addEventListeners();
  }

  protected mouseWheel(fieldName: string, event: WheelEvent): void {
    let value = Number(this.form.get(fieldName)!.value) || 0;
    value += event.deltaY > 0 ? -1 : 1;
    this.form.patchValue({ [fieldName]: value });
    event.stopPropagation();
  }

  protected hasDisallowedContent(): boolean {
    return getCookie(UNBLOCK_CONTENT_COOKIE_NAME) === environment.UNBLOCK_CONTENT_PASSWORD;
  }

  private initializeValues(): void {
    const { voice, rate, pitch, timer, readerViewMode } = this.settings();
    this.form = this.fb.group({
      voice: [voice],
      rate: [rate],
      pitch: [pitch],
      timer: [secondsToTimeString(timer)],
      readerViewMode: [readerViewMode],
      timerEnabled: [timer > 0],
    });
  }

  private addEventListeners(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(100),
        map((valueChanges) => {
          const { timer } = valueChanges;
          return Object.assign(
            { ...valueChanges },
            { timer: timeStringToSeconds(String(timer)) }
          );
        }),
        tap((settings) => {
          this.store.dispatch(settingsUpdateAction({ settings }));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.form
      .get('timerEnabled')
      ?.valueChanges.pipe(
        tap((enabled) => {
          this.form.patchValue({
            timer: enabled
              ? secondsToTimeString(DEFAULT_COUNTDOWN_TIMER_VALUE)
              : '0:00',
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected readonly SETTINGS_VOICE_RATE_DELTA = SETTINGS_VOICE_RATE_DELTA;
  protected readonly SETTINGS_VOICE_PITCH_DELTA = SETTINGS_VOICE_PITCH_DELTA;
  protected readonly Voices = Voices;
}
