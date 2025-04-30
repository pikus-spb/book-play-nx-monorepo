import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import {
  SETTINGS_VOICE_PITCH_DELTA,
  SETTINGS_VOICE_RATE_DELTA,
} from '@book-play/constants';
import { VoiceSettings } from '@book-play/models';
import { ScrollbarDirective } from '@book-play/ui';
import { Store } from '@ngrx/store';
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
  private valueChanges!: Signal<VoiceSettings>;

  constructor() {
    this.initializeValues();
    this.addEventListeners();
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
    this.valueChanges = toSignal(this.form.valueChanges);
  }

  private addEventListeners(): void {
    effect(() => {
      const settings = this.valueChanges();
      if (settings) {
        this.store.dispatch(voiceSettingsUpdateAction({ settings }));
      }
    });
  }

  protected readonly SETTINGS_VOICE_RATE_DELTA = SETTINGS_VOICE_RATE_DELTA;
  protected readonly SETTINGS_VOICE_PITCH_DELTA = SETTINGS_VOICE_PITCH_DELTA;
}
