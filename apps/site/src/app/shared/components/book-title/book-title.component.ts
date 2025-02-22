import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ActiveBookService } from '@book-play/services';

@Component({
  selector: 'book-title',
  templateUrl: './book-title.component.html',
  styleUrls: ['./book-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookTitleComponent {
  private activeBookService = inject(ActiveBookService);
  private router = inject(Router);

  private routeChanged = toSignal(this.router.events);

  public bookTitle = computed(() => {
    const name = this.activeBookService.book()?.fullName;

    if (this.routeChanged() && name && this.router.url === '/player') {
      return name;
    }

    return '';
  });
}
