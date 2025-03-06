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
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {
  COVER_IMG_HEIGHT,
  COVER_IMG_WIDTH,
  DEFAULT_COVER_SRC,
  FB2_GENRES,
} from '@book-play/constants';
import { Book } from '@book-play/models';
import { BooksApiService } from '@book-play/services';
import { showDefaultCoverImage } from '@book-play/utils';
import { firstValueFrom } from 'rxjs';

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
    MatChipSet,
    MatChip,
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
        return this.booksApiService.getBookById(request);
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

  protected readonly COVER_IMG_WIDTH = COVER_IMG_WIDTH;
  protected readonly COVER_IMG_HEIGHT = COVER_IMG_HEIGHT;
  protected readonly FB2_GENRES = FB2_GENRES;
  protected readonly showDefaultCoverImage = showDefaultCoverImage;
}
