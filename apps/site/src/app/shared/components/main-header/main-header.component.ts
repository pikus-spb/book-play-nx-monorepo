import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { PlayerButtonComponent } from '../player-button/player-button.component';
import { ActiveBookService } from '../../services/active-book.service';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlayerButtonComponent, MatIcon, MatFabButton, MatTooltip],
})
export class MainHeaderComponent {
  @Output() showMenu = new EventEmitter<void>();
  private router = inject(Router);
  private activeBook = inject(ActiveBookService).book;
  private routeChanged = toSignal(this.router.events);
  public playerIsActive = computed(() => {
    this.routeChanged();
    return this.activeBook() && this.router.url.indexOf('/player') !== -1;
  });
}
