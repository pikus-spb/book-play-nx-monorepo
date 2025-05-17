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
  SETTINGS_VOICE_PITCH_DELTA,
  SETTINGS_VOICE_RATE_DELTA,
} from '@book-play/constants';
import { Voices, VoiceSettings } from '@book-play/models';
import { ScrollbarDirective } from '@book-play/ui';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { voiceSettingsUpdateAction } from '../../../../shared/store/voice-settings/voice-settings.actions';

import { getVoiceSettings } from '../../../../shared/utils/voice-settings';

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
    ScrollbarDirective,
  ],
})
export class SettingsComponent {
  protected form!: FormGroup;

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.initializeValues();
    this.addEventListeners();
    this.updateDisabledState(this.form.value);
  }

  protected mouseWheel(fieldName: string, event: WheelEvent): void {
    let value = Number(this.form.get(fieldName)!.value) || 0;
    value += event.deltaY > 0 ? -1 : 1;
    this.form.patchValue({ [fieldName]: value });
  }

  private initializeValues(): void {
    const { voice, rate, pitch } = getVoiceSettings();
    this.form = this.fb.group({
      voice: [voice],
      rate: [rate],
      pitch: [pitch],
    });
  }

  private addEventListeners(): void {
    this.form.valueChanges
      .pipe(
        distinctUntilChanged(
          (previous: VoiceSettings, current: VoiceSettings) => {
            return (
              `${previous.voice}${previous.rate}${previous.pitch}` ===
              `${current.voice}${current.rate}${current.pitch}`
            );
          }
        ),
        debounceTime(100),
        tap((settings) => this.updateDisabledState(settings)),
        tap((settings) => {
          this.store.dispatch(voiceSettingsUpdateAction({ settings }));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private updateDisabledState(settings: VoiceSettings): void {
    if (
      [Voices.Jane, Voices.Ermil, Voices.Zahar, Voices.Omazh].includes(
        settings.voice
      )
    ) {
      this.form.controls['pitch'].disable();
    } else {
      this.form.controls['pitch'].enable();
    }
    if (settings.voice === Voices.Piper) {
      this.form.controls['pitch'].disable();
      this.form.controls['rate'].disable();
    } else {
      this.form.controls['rate'].enable();
    }
  }

  protected readonly SETTINGS_VOICE_RATE_DELTA = SETTINGS_VOICE_RATE_DELTA;
  protected readonly SETTINGS_VOICE_PITCH_DELTA = SETTINGS_VOICE_PITCH_DELTA;
  protected readonly Voices = Voices;
}
