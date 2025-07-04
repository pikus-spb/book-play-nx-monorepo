import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterHelperService } from '@book-play/ui';
import { setDocumentTitleWithContext } from '@book-play/utils-browser';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { AutoPlayService } from '../../../../shared/services/tts/auto-play.service';
import {
  activeBookImportFromPersistenceStorageAction,
  activeBookLoadByIdAction,
} from '../../../../shared/store/active-book/active-book.actions';
import { activeBookSelector } from '../../../../shared/store/active-book/active-book.selectors';
import { settingsSelector } from '../../../../shared/store/settings/settings.selectors';
import { CountdownTimerComponent } from '../../../countdown-timer/countdown-timer.component';
import { BookCanvasComponent } from '../book-canvas/book-canvas.component';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCanvasComponent, CountdownTimerComponent],
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

  constructor() {
    // Effect to update window title
    effect(() => {
      const book = this.book();
      if (book !== null && this.routerHelperService.isRouteActive('player')) {
        setDocumentTitleWithContext(book.full);
      }
    });
  }

  public async ngAfterViewInit() {
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
