import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@book-play/constants';
import { AuthorSummary, Book } from '@book-play/models';
import { BooksApiService, LoadingService } from '@book-play/services';
import { AuthorCardComponent, BookCardComponent } from '@book-play/ui';

@Component({
  selector: 'welcome',
  imports: [BookCardComponent, AuthorCardComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  private booksApiService = inject(BooksApiService);
  private loading = inject(LoadingService);

  protected authorSummary = toSignal(
    this.loading.track(this.booksApiService.loadRandomAuthors()),
    { initialValue: [] as AuthorSummary[] }
  );
  protected books = toSignal(
    this.loading.track(this.booksApiService.loadRandomBooks()),
    { initialValue: [] as Book[] }
  );

  protected readonly environment = environment;
}
