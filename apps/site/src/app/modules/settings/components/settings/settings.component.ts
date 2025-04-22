import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { ScrollbarDirective } from '@book-play/ui';
import {
  getVoiceSettings,
  storeVoiceSettings,
} from '../../../../shared/utils/voice-settings';

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
  private fb = inject(FormBuilder);
  protected form: FormGroup;

  constructor() {
    const { voice, rate, pitch } = getVoiceSettings();
    this.form = this.fb.group({
      voice: [voice],
      rate: [rate],
      pitch: [pitch],
    });
  }

  protected onSubmit() {
    const { voice, rate, pitch } = this.form.value;
    storeVoiceSettings({ voice, rate, pitch });
  }
}
