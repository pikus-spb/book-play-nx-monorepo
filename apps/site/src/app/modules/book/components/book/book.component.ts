import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  resource,
  signal,
  WritableSignal,
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
import { firstValueFrom } from 'rxjs';
import { BooksApiService } from '../../../../shared/services/books-api.service';

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
export class BookComponent implements AfterViewInit {
  @Input() id: string | null = null;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private booksApiService = inject(BooksApiService);

  private idSignal: WritableSignal<string | null> = signal(null);

  protected book = resource<Book | null, string | null>({
    request: () => this.idSignal(),
    loader: ({ request }) => {
      if (request !== null) {
        return this.booksApiService.getBookSummaryById(request);
      }
      return Promise.resolve(null);
    },
  });

  public coverSrc = computed(() => {
    const src = this.book.value()?.cover?.toBase64String();
    return src ?? DEFAULT_COVER_SRC;
  });

  public playBook(): void {
    this.router.navigateByUrl('/player/' + this.idSignal());
  }

  public async ngAfterViewInit() {
    let id = this.id;
    if (!id) {
      id = (await firstValueFrom(this.route.paramMap)).get('id');
    }

    this.idSignal.set(id);
  }

  protected readonly BOOK_IMAGE_WIDTH = BOOK_IMAGE_WIDTH;
  protected readonly BOOK_IMAGE_HEIGHT = BOOK_IMAGE_HEIGHT;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
}
