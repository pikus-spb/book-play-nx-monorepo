import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { activeBookSelector } from '../../store/active-book/active-book.selectors';
import { PlayerButtonComponent } from '../player-button/player-button.component';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlayerButtonComponent, MatIcon, MatFabButton, MatTooltip],
})
export class MainHeaderComponent {
  @Output() showMenu = new EventEmitter<void>();
  public playerIsActive = computed(() => {
    return this.activeBook() && this.router.url.indexOf('/player') !== -1;
  });
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private router = inject(Router);
}
