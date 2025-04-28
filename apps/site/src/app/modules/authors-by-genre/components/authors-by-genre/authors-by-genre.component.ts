import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatChipSet } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { GenreAuthor } from '@book-play/models';
import { GenrePipe, GenresPipe, TagLinkComponent } from '@book-play/ui';
import { NgxVirtualScrollModule } from '@lithiumjs/ngx-virtual-scroll';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';
import { loadGenreAuthorsAction } from '../../../../shared/store/genre-authors/genre-authors.actions';
import { genreAuthorsSelector } from '../../../../shared/store/genre-authors/genre-authors.selectors';

@Component({
  selector: 'authors-by-genre',
  templateUrl: './authors-by-genre.component.html',
  styleUrls: ['./authors-by-genre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatChipSet,
    LoadingThenShowDirective,
    NgxVirtualScrollModule,
    GenrePipe,
    GenresPipe,
    NgxVirtualScrollModule,
    TagLinkComponent,
  ],
})
export class AuthorsByGenreComponent implements AfterViewInit {
  @Input() genre: string | null = null;
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  public authorsGenre: WritableSignal<string | null> = signal(null);
  protected viewAuthors: WritableSignal<GenreAuthor[]> = signal<GenreAuthor[]>(
    []
  );

  protected authors = this.store.selectSignal(genreAuthorsSelector);

  constructor() {
    effect(() => {
      const data = this.authors() ?? [];
      this.viewAuthors.set(data);
    });
    effect(() => {
      const genre = this.authorsGenre();
      if (genre !== null) {
        this.store.dispatch(loadGenreAuthorsAction({ genre }));
      }
    });
  }

  public async ngAfterViewInit() {
    let genre = this.genre;
    if (!genre) {
      genre = (await firstValueFrom(this.route.paramMap)).get('genre');
    }

    this.authorsGenre.set(genre);
  }

  protected trackByFn(index: number, item: GenreAuthor): string {
    return item.id;
  }

  protected inputFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const data = (this.authors() ?? []).filter(
      (item) => item.full.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.viewAuthors.set(data);
  }
}
