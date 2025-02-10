import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { PlayerButtonComponent } from 'app/modules/player/components/player-button/player-button.component';
import { ActiveBookService } from 'app/shared/services/active-book.service';
import { merge, tap } from 'rxjs';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, PlayerButtonComponent],
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
