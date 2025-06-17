import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { BasicBookData } from '@book-play/models';
import { ScrollbarDirective, TagLinkComponent } from '@book-play/ui';
import { NgxVirtualScrollModule } from '@lithiumjs/ngx-virtual-scroll';
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
    NgxVirtualScrollModule,
    LoadingThenShowDirective,
    TagLinkComponent,
    MatChipSet,
    FormsModule,
    MatFabButton,
    MatIcon,
    ScrollbarDirective,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent {
  private store = inject(Store);
  protected data = this.store.selectSignal(bookSearchSelector);
  protected errors = this.store.selectSignal(bookSearchErrorsSelector);
  protected query: WritableSignal<any> = signal<string>('');

  protected search(): void {
    this.store.dispatch(
      bookSearchAction({
        query: this.query(),
      })
    );
    console.log(this.query());
  }

  protected trackByFn(index: number, item: BasicBookData): string {
    return item.full;
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
