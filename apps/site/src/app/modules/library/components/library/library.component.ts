import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  resource,
  signal,
} from '@angular/core';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { FB2_GENRES } from '@book-play/constants';
import { Author } from '@book-play/models';
import { NgxVirtualScrollModule } from '@lithiumjs/ngx-virtual-scroll';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';
import { BooksApiService } from '../../../../shared/services/books-api.service';
import {
  AppEventNames,
  EventsStateService,
} from '../../../../shared/services/events-state.service';

@Component({
  selector: 'library',
  imports: [
    CommonModule,
    LoadingThenShowDirective,
    NgxVirtualScrollModule,
    MatChip,
    MatChipSet,
  ],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  protected data = resource<Author[], unknown>({
    loader: () => this.booksApi.getAllAuthors(),
  });

  protected viewData = signal<Author[]>([]);

  constructor(
    public booksApi: BooksApiService,
    public eventStates: EventsStateService
  ) {
    effect(() => {
      if (this.data.isLoading()) {
        this.eventStates.add(AppEventNames.loading);
      } else {
        const data = this.data.value() ?? [];
        this.viewData.set(data);
        this.eventStates.remove(AppEventNames.loading);
      }
    });
  }

  protected inputFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const data = (this.data.value() ?? []).filter(
      (item) => item.full.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.viewData.set(data);
  }

  protected trackByFn(index: number, item: Author): string {
    return item.full;
  }

  protected readonly FB2_GENRES = FB2_GENRES;
}
