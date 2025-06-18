import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
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
} from '@book-play/constants';
import { Book } from '@book-play/models';
import { AuthorGenresListComponent } from '@book-play/ui';
import { showDefaultCoverImage } from '@book-play/utils-browser';
import { map } from 'rxjs';

@Component({
  selector: 'book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFabButton,
    MatIcon,
    MatTooltip,
    RouterLink,
    AuthorGenresListComponent,
  ],
})
export class BookComponent {
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

  public playBook(): void {
    this.router.navigateByUrl('/player/' + this.book()?.id);
  }

  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
}
