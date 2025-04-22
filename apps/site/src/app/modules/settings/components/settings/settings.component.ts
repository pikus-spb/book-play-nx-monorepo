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
import { VoiceSettings } from '@book-play/models';
import { ScrollbarDirective } from '@book-play/ui';
import { Store } from '@ngrx/store';

import { ttsVoiceSettingsUpdateAction } from '../../../../shared/store/tts/tts.actions';
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
        this.store.dispatch(ttsVoiceSettingsUpdateAction({ voice: settings }));
      }
    });
  }
}
