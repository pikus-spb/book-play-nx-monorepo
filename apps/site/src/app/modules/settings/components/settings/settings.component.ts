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
import { distinctUntilChanged, Observable, tap } from 'rxjs';
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
  private valueChanges$!: Observable<VoiceSettings>;
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
    this.valueChanges$ = this.form.valueChanges;
  }

  private addEventListeners(): void {
    this.valueChanges$
      .pipe(
        distinctUntilChanged(
          (previous: VoiceSettings, current: VoiceSettings) => {
            return JSON.stringify(previous) === JSON.stringify(current);
          }
        ),
        tap((settings) => this.updateDisabledState(settings)),
        tap((settings) => {
          this.store.dispatch(voiceSettingsUpdateAction({ settings }));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private updateDisabledState(settings: VoiceSettings): void {
    if ([Voices.Jane, Voices.Ermil].includes(settings.voice)) {
      this.form.controls['pitch'].disable();
    } else {
      this.form.controls['pitch'].enable();
    }
  }

  protected readonly SETTINGS_VOICE_RATE_DELTA = SETTINGS_VOICE_RATE_DELTA;
  protected readonly SETTINGS_VOICE_PITCH_DELTA = SETTINGS_VOICE_PITCH_DELTA;
  protected readonly Voices = Voices;
}
