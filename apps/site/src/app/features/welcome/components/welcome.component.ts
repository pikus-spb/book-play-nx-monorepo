import { Component, inject, OnInit } from '@angular/core';
import {
  loadRandomAuthorsAction,
  loadRandomBooksAction,
  randomAuthorsSelector,
  randomBooksSelector,
} from '@book-play/store';
import { AuthorCardComponent, BookCardComponent } from '@book-play/ui';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';

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
