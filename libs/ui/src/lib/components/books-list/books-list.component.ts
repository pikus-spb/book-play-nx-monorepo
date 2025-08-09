import {
  ChangeDetectionStrategy,
  Component,
  input,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book, BookData } from '@book-play/models';
import { StarRatingComponent } from '../rating/star-rating.component';

@Component({
  selector: 'lib-books-list',
  imports: [StarRatingComponent, RouterLink],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListComponent {
  public data =
    input<Signal<Partial<Book>[] | BookData[] | null | undefined>>();
  public title = input<string>('Результаты поиска');
  public noDataText = input<string>(
    'По Вашему запросу найти книги не удалось.'
  );
}
