import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { loadRandomAuthorsAction } from '../../../shared/store/random-author-details/random-author-summary.actions';
import { randomAuthorsSelector } from '../../../shared/store/random-author-details/random-author-summary.selectors';
import { loadRandomBooksAction } from '../../../shared/store/random-books/random-books.actions';
import { randomBooksSelector } from '../../../shared/store/random-books/random-books.selectors';
import { AuthorCardComponent } from '../../author-card/components/author-card/author-card.component';
import { BookCardComponent } from '../../book-card/components/book-card/book-card.component';

@Component({
  selector: 'welcome',
  imports: [BookCardComponent, AuthorCardComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  private store = inject(Store);

  protected authorSummary = this.store.selectSignal(randomAuthorsSelector);
  protected books = this.store.selectSignal(randomBooksSelector);

  public ngOnInit(): void {
    this.store.dispatch(loadRandomAuthorsAction());
    this.store.dispatch(loadRandomBooksAction());
  }

  protected readonly environment = environment;
}
