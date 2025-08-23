import {
  ChangeDetectionStrategy,
  Component,
  input,
  Signal,
} from '@angular/core';
import { Book, BookData } from '@book-play/models';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'lib-books-list',
  imports: [StarRatingComponent, BookDetailsComponent],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListComponent {
  public data =
    input<Signal<Partial<Book>[] | BookData[] | null | undefined>>();
  public headerText = input<string>('Результаты поиска');
  public noDataText = input<string>(
    'По Вашему запросу найти книги не удалось.'
  );
}
