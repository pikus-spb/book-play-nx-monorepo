import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { MatChipSet } from '@angular/material/chips';
import { Author } from '@book-play/models';
import { ScrollbarDirective, TagLinkComponent } from '@book-play/ui';
import { NgxVirtualScrollModule } from '@lithiumjs/ngx-virtual-scroll';
import { Store } from '@ngrx/store';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';
import { BooksApiService } from '../../../../shared/services/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../../../../shared/store/loading/loading.action';

@Component({
  selector: 'library',
  imports: [
    CommonModule,
    LoadingThenShowDirective,
    NgxVirtualScrollModule,
    MatChipSet,
    TagLinkComponent,
    ScrollbarDirective,
  ],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  protected data = resource<Author[], unknown>({
    loader: () => this.booksApi.getAllAuthors(),
  });

  public booksApi = inject(BooksApiService);
  protected viewData = signal<Author[]>([]);
  private store = inject(Store);

  constructor() {
    effect(() => {
      if (this.data.isLoading()) {
        this.store.dispatch(loadingStartAction());
      } else {
        const data = this.data.value() ?? [];
        this.viewData.set(data);
        this.store.dispatch(loadingEndAction());
      }
    });
  }

  protected inputFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const data = (this.data.value() ?? []).filter(
      (item) => item.full.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.viewData.set(data);
  }

  protected trackByFn(index: number, item: Author): string {
    return item.full;
  }
}
