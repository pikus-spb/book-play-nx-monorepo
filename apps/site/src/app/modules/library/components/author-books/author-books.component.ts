import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  resource,
} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { Author, Book } from '@book-play/models';
import { LoadingIndicatorComponent } from '../../../../shared/components/loading-indicator/loading-indicator.component';
import { BooksApiService } from '../../../../shared/services/books-api.service';

@Component({
  selector: 'author-books',
  imports: [
    CommonModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    LoadingIndicatorComponent,
  ],
  templateUrl: './author-books.component.html',
  styleUrl: './author-books.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorBooksComponent {
  @Input() author!: Author;
  protected books = resource<Book[], unknown>({
    loader: async () => {
      await this.click;
      return this.booksApiService.getAuthorBooks(this.author.id!);
    },
  });

  protected loadBooks!: () => void;

  private click = new Promise((resolve) => {
    this.loadBooks = resolve as () => void;
  });
  private booksApiService = inject(BooksApiService);
}
