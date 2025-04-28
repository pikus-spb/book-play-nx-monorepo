import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatChipSet } from '@angular/material/chips';
import { ScrollbarDirective, TagLinkComponent } from '@book-play/ui';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { loadRandomAuthorsAction } from '../../../shared/store/random-authors/random-authors.actions';
import { randomAuthorsSelector } from '../../../shared/store/random-authors/random-authors.selectors';
import { loadRandomBooksAction } from '../../../shared/store/random-books/random-books.actions';
import { randomBooksSelector } from '../../../shared/store/random-books/random-books.selectors';
import { BookComponent } from '../../book/components/book/book.component';

@Component({
  selector: 'welcome',
  imports: [
    CommonModule,
    BookComponent,
    MatChipSet,
    TagLinkComponent,
    ScrollbarDirective,
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  private store = inject(Store);

  protected authors = this.store.selectSignal(randomAuthorsSelector);
  protected books = this.store.selectSignal(randomBooksSelector);

  public ngOnInit(): void {
    this.store.dispatch(loadRandomAuthorsAction());
    this.store.dispatch(loadRandomBooksAction());
  }

  protected readonly environment = environment;
}
