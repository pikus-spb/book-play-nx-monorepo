import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BOOK_IMAGE_HEIGHT,
  BOOK_IMAGE_WIDTH,
  DEFAULT_COVER_SRC,
  NOT_AVAILABLE,
} from '@book-play/constants';
import { Book } from '@book-play/models';
import {
  setDocumentTitleWithContext,
  showDefaultCoverImage,
} from '@book-play/utils-browser';
import { StarRatingModule } from 'angular-star-rating';
import { map } from 'rxjs';
import { AuthorGenresListComponent } from '../author-genres-list/author-genres-list.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

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
    MatFabButton,
    MatTooltip,
  ],
})
export class BookCardComponent implements OnInit {
  public inputBook = input<Book | null>(null, { alias: 'book' });
  public updateWindowTitle = input<boolean>(true);
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

  ngOnInit() {
    if (this.updateWindowTitle()) {
      const book = this.book();
      if (book !== null) {
        setDocumentTitleWithContext(book.full);
      }
    }
  }

  public playBook(): void {
    this.router.navigateByUrl('/player/' + this.book()?.id);
  }

  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
  protected readonly NOT_AVAILABLE = NOT_AVAILABLE;
}
