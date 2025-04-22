import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Book } from '@book-play/models';
import { LinkComponent } from '@book-play/ui';
import { ActiveBookService } from '../../services/books/active-book.service';

@Component({
  selector: 'book-title',
  templateUrl: './book-title.component.html',
  styleUrls: ['./book-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LinkComponent],
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
