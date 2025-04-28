import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorGenresListComponent } from '@book-play/ui';
import { hideImage } from '@book-play/utils-browser';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { loadAuthorSummaryAction } from '../../../../shared/store/author-summary/author-summary.actions';
import { authorSummarySelector } from '../../../../shared/store/author-summary/author-summary.selectors';

@Component({
  selector: 'author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, AuthorGenresListComponent],
})
export class AuthorComponent implements AfterViewInit {
  @Input() id: string | null = null;
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private authorId: WritableSignal<string | null> = signal(null);
  protected authorSummary = this.store.selectSignal(authorSummarySelector);

  constructor() {
    effect(() => {
      const authorId = this.authorId();
      if (authorId !== null) {
        this.store.dispatch(loadAuthorSummaryAction({ authorId }));
      }
    });
  }

  public async ngAfterViewInit() {
    let id = this.id;
    if (!id) {
      id = (await firstValueFrom(this.route.paramMap)).get('id');
    }

    this.authorId.set(id);
  }

  protected readonly hideImage = hideImage;
}
