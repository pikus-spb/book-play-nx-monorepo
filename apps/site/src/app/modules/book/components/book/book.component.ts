import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BOOK_IMAGE_HEIGHT,
  BOOK_IMAGE_WIDTH,
  DEFAULT_COVER_SRC,
} from '@book-play/constants';
import { Book } from '@book-play/models';
import { AuthorGenresListComponent } from '@book-play/ui';
import { showDefaultCoverImage } from '@book-play/utils-browser';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { loadBookSummaryAction } from '../../../../shared/store/book-summary/book-summary.actions';
import { bookSummarySelector } from '../../../../shared/store/book-summary/book-summary.selectors';

@Component({
  selector: 'book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatFabButton,
    MatIcon,
    MatTooltip,
    RouterLink,
    AuthorGenresListComponent,
  ],
})
export class BookComponent {
  public bookInput = input<Book | null>(null, { alias: 'book' });
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected bookLoaded = this.store.selectSignal<Book | null>(
    bookSummarySelector
  );
  protected book = computed<Book | null>(() => {
    return this.bookInput() || this.bookLoaded();
  });

  constructor() {
    effect(async () => {
      const book = this.bookInput();
      if (!book) {
        const id = (await firstValueFrom(this.route.paramMap)).get('id');
        if (id) {
          this.store.dispatch(loadBookSummaryAction({ bookId: id }));
        }
      }
    });
  }

  public coverSrc = computed(() => {
    const src = this.book()?.cover?.toBase64String();
    return src ?? DEFAULT_COVER_SRC;
  });

  public playBook(): void {
    this.router.navigateByUrl('/player/' + this.book()?.id);
  }

  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
}
