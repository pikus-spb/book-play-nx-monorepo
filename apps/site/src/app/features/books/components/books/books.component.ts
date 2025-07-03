import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ScrollbarDirective, TagLinkComponent } from '@book-play/ui';
import { Store } from '@ngrx/store';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';
import { bookSearchAction } from '../../../../shared/store/book-search/book-search.actions';
import {
  bookSearchErrorsSelector,
  bookSearchSelector,
} from '../../../../shared/store/book-search/book-search.selectors';

@Component({
  selector: 'books',
  imports: [
    CommonModule,
    LoadingThenShowDirective,
    MatIcon,
    ScrollbarDirective,
    TagLinkComponent,
    MatFabButton,
    FormsModule,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  private store = inject(Store);
  protected data = this.store.selectSignal(bookSearchSelector);
  protected errors = this.store.selectSignal(bookSearchErrorsSelector);
  protected query = model<string | null>('');
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
    this.store.dispatch(
      bookSearchAction({
        query: this.query() ?? '',
      })
    );
  }

  protected submit(event: Event): void {
    this.router.navigateByUrl(`/books/${this.query()}`);
    event.preventDefault();
  }
}
