import { CommonModule } from '@angular/common';
import { Component, inject, resource } from '@angular/core';
import { MatChipSet } from '@angular/material/chips';
import { Author } from '@book-play/models';
import { TagLinkComponent } from '@book-play/ui';
import { BooksApiService } from '../../../shared/services/books-api.service';
import { BookComponent } from '../../book/components/book/book.component';

@Component({
  selector: 'welcome',
  imports: [CommonModule, BookComponent, MatChipSet, TagLinkComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  protected booksApiService = inject(BooksApiService);

  protected authors = resource<Author[], unknown>({
    loader: () => this.booksApiService.getRandomAuthors(),
  });
  protected ids = resource<string[], unknown>({
    loader: () => this.booksApiService.getRandomIds(),
  });
}
