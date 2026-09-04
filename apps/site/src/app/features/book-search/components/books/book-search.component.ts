import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  OnInit,
  resource,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { BooksApiService, LoadingService } from '@book-play/services';
import { BooksListComponent } from '@book-play/ui';
import { firstValueFrom } from 'rxjs';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';

@Component({
  selector: 'books',
  imports: [
    CommonModule,
    LoadingThenShowDirective,
    MatIcon,
    MatFabButton,
    FormsModule,
    RouterLink,
    BooksListComponent,
  ],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookSearchComponent implements OnInit {
  private booksApiService = inject(BooksApiService);
  private loading = inject(LoadingService);
  protected query = model<string | null>('');
  protected data = resource({
    params: () => this.query() || '',
    loader: async ({ params }) => {
      if (!params) {
        return null;
      }
      return this.loading.trackPromise(
        firstValueFrom(this.booksApiService.bookSearch(params))
      );
    },
  });
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initSearch();
        }
      });

    this.initSearch();
  }

  protected initSearch(): void {
    this.query.set(this.route.snapshot.paramMap.get('search'));
  }

  protected submit(event: Event): void {
    this.router.navigateByUrl(`/books/${this.query()}`);
    event.preventDefault();
  }
}
