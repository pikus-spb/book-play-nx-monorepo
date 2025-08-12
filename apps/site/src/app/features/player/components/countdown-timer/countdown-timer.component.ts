import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_COUNTDOWN_TIMER_VALUE } from '@book-play/constants';
import { settingsSelector } from '@book-play/store';
import { Store } from '@ngrx/store';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
} from 'ngx-countdown';
import { AutoPlayService } from '../../../../shared/services/auto-play.service';

@Component({
  selector: 'countdown-timer',
  imports: [CountdownComponent],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent {
  public complete = output<void>();
  private autoPlayService = inject(AutoPlayService);
  protected stopped = toSignal(this.autoPlayService.stopped$);
  protected countdownConfig: CountdownConfig = {
    leftTime: DEFAULT_COUNTDOWN_TIMER_VALUE,
    format: 'HH:mm:ss',
    demand: true,
    notify: 1,
  };
  private countDownComponent = viewChild(CountdownComponent);
  private store = inject(Store);
  private settings = this.store.selectSignal(settingsSelector);

  constructor() {
    effect(() => {
      this.checkStopped();
    });

    effect(() => {
      this.countdownConfig.leftTime = this.settings().timer;
    });
  }

  protected togglePlay() {
    this.autoPlayService.toggle();
  }

  protected trigger($event: CountdownEvent) {
    if ($event.action === 'done') {
      this.autoPlayService.stop();
      this.resetTimer();
      this.complete.emit();
    }
  }

  protected resetTimer() {
    this.countDownComponent()?.restart();
    this.checkStopped();
  }

  private checkStopped() {
    if (this.stopped()) {
      this.countDownComponent()?.pause();
    } else {
      this.countDownComponent()?.resume();
    }
  }
}
