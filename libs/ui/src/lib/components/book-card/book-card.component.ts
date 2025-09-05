import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import {
  BLOCKED_BOOK_TEXT,
  BOOK_IMAGE_HEIGHT,
  BOOK_IMAGE_WIDTH,
  DEFAULT_COVER_SRC,
  NOT_AVAILABLE,
} from '@book-play/constants';
import { Book } from '@book-play/models';
import { showDefaultCoverImage } from '@book-play/utils-browser';
import { StarRatingModule } from 'angular-star-rating';
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
export class BookCardComponent {
  public book = input<Book | null>(null);
  private router = inject(Router);

  public coverSrc = computed(() => {
    const src = this.book()?.cover?.toBase64String();
    return src ?? DEFAULT_COVER_SRC;
  });

  public playBook(): void {
    this.router.navigateByUrl('/player/' + this.book()?.id);
  }

  protected readonly BLOCKED_BOOK_TEXT = BLOCKED_BOOK_TEXT;
  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
  protected readonly NOT_AVAILABLE = NOT_AVAILABLE;
}
