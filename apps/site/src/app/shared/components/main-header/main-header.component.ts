import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { merge, tap } from 'rxjs';
import { ActiveBookService } from '../../services/books/active-book.service';
import { PlayerButtonComponent } from '../player-button/player-button.component';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlayerButtonComponent, MatIcon, MatFabButton, MatTooltip],
})
export class MainHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  public showPlayerButton: WritableSignal<boolean> = signal(false);

  constructor(
    private openedBookService: ActiveBookService,
    private router: Router
  ) {
    merge(toObservable(this.openedBookService.book), this.router.events)
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.showPlayerButton.set(
            openedBookService.book() !== null &&
              router.url.indexOf('/player') !== -1
          );
        })
      )
      .subscribe();
  }
}
