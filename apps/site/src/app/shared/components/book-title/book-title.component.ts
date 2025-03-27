import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Book } from '@book-play/models';
import { ActiveBookService } from '../../services/active-book.service';

@Component({
  selector: 'book-title',
  templateUrl: './book-title.component.html',
  styleUrls: ['./book-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class BookTitleComponent {
  private activeBookService = inject(ActiveBookService);
  private router = inject(Router);

  private routeChanged = toSignal(this.router.events);

  public book = computed<Book | null>(() => {
    const book = this.activeBookService.book();

    if (
      this.routeChanged() &&
      book &&
      this.router.url.indexOf('player') !== -1
    ) {
      return book;
    }

    return null;
  });
}
