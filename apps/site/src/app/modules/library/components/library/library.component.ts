import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  resource,
} from '@angular/core';
import { Author } from '@book-play/models';
import {
  AppEventNames,
  BooksApiService,
  EventsStateService,
} from '@book-play/services';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';
import { AuthorBooksComponent } from '../author-books/author-books.component';

@Component({
  selector: 'library',
  imports: [CommonModule, AuthorBooksComponent, LoadingThenShowDirective],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  public data = resource<Author[], unknown>({
    loader: () => this.booksApi.getAllAuthors(),
  });

  constructor(
    public booksApi: BooksApiService,
    public eventStates: EventsStateService
  ) {
    effect(() => {
      if (this.data.isLoading()) {
        this.eventStates.add(AppEventNames.loading);
      } else {
        this.eventStates.remove(AppEventNames.loading);
      }
    });
  }
}
