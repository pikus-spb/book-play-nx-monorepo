import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { merge, tap } from 'rxjs';
import { activeBookSelector } from '../../store/books-cache/active-book.selectors';
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
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private router = inject(Router);

  constructor() {
    merge(toObservable(this.activeBook), this.router.events)
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.showPlayerButton.set(
            this.activeBook() !== null &&
              this.router.url.indexOf('/player') !== -1
          );
        })
      )
      .subscribe();
  }
}
