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
import { Store } from '@ngrx/store';
import { activeBookSelector } from '../../store/books-cache/active-book.selectors';

@Component({
  selector: 'book-title',
  templateUrl: './book-title.component.html',
  styleUrls: ['./book-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LinkComponent],
})
export class BookTitleComponent {
  private store = inject(Store);
  private activeBook = this.store.selectSignal(activeBookSelector);
  private router = inject(Router);

  private routeChanged = toSignal(this.router.events);

  public book = computed<Book | null>(() => {
    const book = this.activeBook();

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
