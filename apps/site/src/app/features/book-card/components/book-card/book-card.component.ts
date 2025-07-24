import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BOOK_IMAGE_HEIGHT,
  BOOK_IMAGE_WIDTH,
  DEFAULT_COVER_SRC,
} from '@book-play/constants';
import { Book } from '@book-play/models';
import { AuthorGenresListComponent, StarRatingComponent } from '@book-play/ui';
import {
  setDocumentTitleWithContext,
  showDefaultCoverImage,
} from '@book-play/utils-browser';
import { StarRatingModule } from 'angular-star-rating';
import { map } from 'rxjs';

@Component({
  selector: 'book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StarRatingModule,
    RouterLink,
    AuthorGenresListComponent,
    StarRatingComponent,
    MatIcon,
  ],
})
export class BookCardComponent {
  public inputBook = input<Book | null>(null, { alias: 'book' });
  private route = inject(ActivatedRoute);
  private routeBook = toSignal(
    this.route.data.pipe(map((data) => data['book']))
  );
  private router = inject(Router);
  protected book = computed<Book | null>(() => {
    return this.inputBook() || this.routeBook();
  });

  public coverSrc = computed(() => {
    const src = this.book()?.cover?.toBase64String();
    return src ?? DEFAULT_COVER_SRC;
  });

  constructor() {
    // Effect to update window title
    effect(() => {
      const book = this.book();
      if (book !== null) {
        setDocumentTitleWithContext(book.full);
      }
    });
  }

  public playBook(): void {
    this.router.navigateByUrl('/player/' + this.book()?.id);
  }

  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
}
