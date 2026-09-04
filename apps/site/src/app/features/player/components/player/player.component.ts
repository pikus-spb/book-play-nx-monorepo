import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { DefaultSettings } from '@book-play/models';
import { getSettings } from '@book-play/services';
import { KeepScreenOnComponent } from '@book-play/ui';
import { log } from '@book-play/utils-common';
import { fromEvent, merge } from 'rxjs';
import { ActiveBookService } from '../../../../shared/services/active-book.service';
import { AutoPlayService } from '../../../../shared/services/auto-play.service';

import { BookCanvasComponent } from '../book-canvas/book-canvas.component';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BookCanvasComponent,
    CountdownTimerComponent,
    KeepScreenOnComponent,
  ],
  host: {
    '[class]': 'getReaderViewModeClass()',
  },
})
export class PlayerComponent {
  private autoPlayService = inject(AutoPlayService);
  public book = inject(ActiveBookService).book;
  protected countDownEnabled = signal(getSettings().timer > 0);
  protected keepScreenOnEnable: WritableSignal<boolean> = signal(true);

  protected countdownTimerComplete() {
    this.keepScreenOnEnable.set(false);
    log('Countdown time complete - turning off keep screen on...');

    const subscription = merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'touchend')
    ).subscribe(() => {
      this.keepScreenOnEnable.set(true);
      subscription.unsubscribe();
      log('Keep screen on restarted');
    });
  }

  protected getReaderViewModeClass(): string {
    return (
      localStorage.getItem('readerViewMode') || DefaultSettings.readerViewMode
    );
  }

  public startPlayParagraph(index: number): void {
    this.autoPlayService.stop();
    this.autoPlayService.start(index);
  }
}
