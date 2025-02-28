import { CommonModule } from '@angular/common';
import { Component, inject, resource } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Author } from '@book-play/models';
import { BooksApiService } from '@book-play/services';
import { AuthorBooksComponent } from '../../library/components/author-books/author-books.component';

@Component({
  selector: 'welcome',
  imports: [CommonModule, AuthorBooksComponent, MatAccordion],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  protected booksApiService = inject(BooksApiService);

  protected authors = resource<Author[], unknown>({
    loader: () => this.booksApiService.getRandomAuthors(),
  });
}
