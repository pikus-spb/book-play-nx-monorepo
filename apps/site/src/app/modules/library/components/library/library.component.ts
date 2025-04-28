import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatChipSet } from '@angular/material/chips';
import { Author } from '@book-play/models';
import { ScrollbarDirective, TagLinkComponent } from '@book-play/ui';
import { NgxVirtualScrollModule } from '@lithiumjs/ngx-virtual-scroll';
import { Store } from '@ngrx/store';
import { LoadingThenShowDirective } from '../../../../shared/directives/loading-then-show/loading-then-show.directive';
import { loadAllAuthorsAction } from '../../../../shared/store/all-authors/all-authors.actions';
import { allAuthorsSelector } from '../../../../shared/store/all-authors/all-authors.selectors';

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
  private store = inject(Store);
  protected data = this.store.selectSignal(allAuthorsSelector);
  protected viewData = signal<Author[]>([]);

  constructor() {
    this.store.dispatch(loadAllAuthorsAction());

    effect(() => {
      const data = this.data() ?? [];
      this.viewData.set(data);
    });
  }

  protected inputFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const data = (this.data() ?? []).filter(
      (item) => item.full.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.viewData.set(data);
  }

  protected trackByFn(index: number, item: Author): string {
    return item.full;
  }
}
