import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthorSummary } from '@book-play/models';
import { hideImage } from '@book-play/utils-browser';
import { AuthorGenresListComponent } from '../author-genres-list/author-genres-list.component';
import { BooksListComponent } from '../books-list/books-list.component';

@Component({
  selector: 'author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthorGenresListComponent, BooksListComponent],
})
export class AuthorCardComponent {
  public author = input<AuthorSummary | null>(null);

  protected readonly hideImage = hideImage;
  protected readonly signal = signal;
}
