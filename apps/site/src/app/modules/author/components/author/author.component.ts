import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  resource,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorSummary } from '@book-play/models';
import { GenrePipe } from '@book-play/ui';
import { hideImage } from '@book-play/utils-browser';
import { firstValueFrom } from 'rxjs';
import { BooksApiService } from '../../../../shared/services/books-api.service';

@Component({
  selector: 'author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatChipSet, MatChip, GenrePipe, RouterLink],
})
export class AuthorComponent implements AfterViewInit {
  @Input() id: string | null = null;
  private route = inject(ActivatedRoute);
  private booksApiService = inject(BooksApiService);

  private idSignal: WritableSignal<string | null> = signal(null);

  protected authorSummary = resource<AuthorSummary | null, string | null>({
    request: () => this.idSignal(),
    loader: ({ request }) => {
      if (request !== null) {
        return this.booksApiService.getAuthorSummary(request);
      }
      return Promise.resolve(null);
    },
  });

  public async ngAfterViewInit() {
    let id = this.id;
    if (!id) {
      id = (await firstValueFrom(this.route.paramMap)).get('id');
    }

    this.idSignal.set(id);
  }

  protected readonly hideImage = hideImage;
}
