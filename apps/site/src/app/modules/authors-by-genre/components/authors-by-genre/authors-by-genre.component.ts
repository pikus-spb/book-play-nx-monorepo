import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  resource,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { AuthorByGenre } from '@book-play/models';
import { GenrePipe, GenresPipe } from '@book-play/ui';
import { NgxVirtualScrollModule } from '@lithiumjs/ngx-virtual-scroll';
import { result } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';
import { BooksApiService } from '../../../../shared/services/books-api.service';
import {
  AppEventNames,
  EventsStateService,
} from '../../../../shared/services/events-state.service';

@Component({
  selector: 'authors-by-genre',
  templateUrl: './authors-by-genre.component.html',
  styleUrls: ['./authors-by-genre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatChipSet,
    MatChip,
    LoadingThenShowDirective,
    NgxVirtualScrollModule,
    GenrePipe,
    GenresPipe,
    NgxVirtualScrollModule,
  ],
})
export class AuthorsByGenreComponent implements AfterViewInit {
  @Input() genre: string | null = null;
  private route = inject(ActivatedRoute);
  private booksApiService = inject(BooksApiService);

  public genreSignal: WritableSignal<string | null> = signal(null);

  protected viewAuthors: WritableSignal<AuthorByGenre[]> = signal<
    AuthorByGenre[]
  >([]);

  protected authors = resource<AuthorByGenre[] | null, string | null>({
    request: () => this.genreSignal(),
    loader: ({ request }) => {
      if (request !== null) {
        return this.booksApiService.getAuthorsByGenre(request);
      }
      return Promise.resolve(null);
    },
  });

  constructor(public eventStatesService: EventsStateService) {
    effect(() => {
      if (this.authors.isLoading()) {
        this.eventStatesService.add(AppEventNames.loading);
      } else {
        const data = this.authors.value() ?? [];
        this.viewAuthors.set(data);
        this.eventStatesService.remove(AppEventNames.loading);
      }
    });
  }

  public async ngAfterViewInit() {
    let genre = this.genre;
    if (!genre) {
      genre = (await firstValueFrom(this.route.paramMap)).get('genre');
    }

    this.genreSignal.set(genre);
  }

  protected trackByFn(index: number, item: AuthorByGenre): string {
    return item.id;
  }

  protected inputFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const data = (this.authors.value() ?? []).filter(
      (item) => item.full.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.viewAuthors.set(data);
  }

  protected readonly result = result;
}
