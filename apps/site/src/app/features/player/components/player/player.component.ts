import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterHelperService } from '@book-play/services';
import {
  activeBookImportFromPersistenceStorageAction,
  activeBookLoadByIdAction,
  activeBookSelector,
  settingsSelector,
} from '@book-play/store';
import { KeepScreenOnComponent } from '@book-play/ui';
import { setDocumentTitleWithContext } from '@book-play/utils-browser';
import { log } from '@book-play/utils-common';
import { Store } from '@ngrx/store';
import { firstValueFrom, fromEvent, merge } from 'rxjs';
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
})
export class PlayerComponent implements AfterViewInit {
  private autoPlayService = inject(AutoPlayService);
  private route = inject(ActivatedRoute);
  private routerHelperService = inject(RouterHelperService);
  private store = inject(Store);
  public book = this.store.selectSignal(activeBookSelector);
  private settings = this.store.selectSignal(settingsSelector);
  protected countDownEnabled = linkedSignal(() => {
    return this.settings().timer > 0;
  });
  protected keepScreenOnEnable: WritableSignal<boolean> = signal(true);

  constructor() {
    // Effect to update window title
    effect(() => {
      const book = this.book();
      if (book !== null && this.routerHelperService.isRouteActive('player')) {
        setDocumentTitleWithContext(book.full);
      }
    });
  }

  public ngAfterViewInit() {
    this.initActiveBook();
  }

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

  private async initActiveBook() {
    const id = (await firstValueFrom(this.route.paramMap)).get('id');
    if (id) {
      this.store.dispatch(activeBookLoadByIdAction({ id }));
    } else {
      this.store.dispatch(activeBookImportFromPersistenceStorageAction());
    }
  }

  public startPlayParagraph(index: number): void {
    this.autoPlayService.stop();
    this.autoPlayService.start(index);
  }
}
