import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  FB2_GENRES_KEY_VALUE_SWAPPED,
  FB2_GENRES_UNIQUE_NAME_SORTED,
  FB_GENRES_TRANSLATED_STRUCTURED,
} from '@book-play/constants';
import { AdvancedSearchParams } from '@book-play/models';
import { ScrollbarDirective, TagLinkComponent } from '@book-play/ui';
import { Store } from '@ngrx/store';
import { StarRatingModule } from 'angular-star-rating';
import { firstValueFrom, timer } from 'rxjs';
import { BooksApiService } from '../../../../shared/services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../../../../shared/store/loading/loading.action';

@Component({
  selector: 'books',
  imports: [
    CommonModule,
    ScrollbarDirective,
    TagLinkComponent,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatFabButton,
    ReactiveFormsModule,
    RouterLink,
    StarRatingModule,
  ],
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSearchComponent {
  private booksApiService = inject(BooksApiService);
  protected data: WritableSignal<any> = signal(null);
  protected error: WritableSignal<any> = signal(null);
  private fb = inject(FormBuilder);
  protected form: FormGroup;
  private store = inject(Store);
  private genresContainer = viewChild<ElementRef>('genresContainer');

  constructor() {
    const genres = FB2_GENRES_UNIQUE_NAME_SORTED.reduce(
      (memo: Record<string, [boolean]>, genre) => {
        memo[genre] = [false];
        return memo;
      },
      {}
    );

    this.form = this.fb.group({
      ...genres,
      rating: [],
      mode: ['and'],
    });
  }

  protected async submit(event: Event) {
    this.store.dispatch(loadingStartAction());

    let data;
    try {
      const params: AdvancedSearchParams = {
        genres: this.getFormGenresParams(),
        ...this.getFormFixedParams(),
      };

      data = await firstValueFrom(this.booksApiService.advancedSearch(params));
    } catch (e) {
      this.error.set(e);
    }

    if (data) {
      this.data.set(data);
    }

    event.preventDefault();

    await firstValueFrom(timer(100));

    this.store.dispatch(loadingEndAction());
    this.genresContainer()?.nativeElement.removeAttribute('open');
  }

  private getFormFixedParams() {
    return {
      rating: this.form.get('rating')?.value,
      mode: this.form.get('mode')?.value,
    };
  }

  private getFormGenresParams() {
    return FB2_GENRES_UNIQUE_NAME_SORTED.reduce((memo: string[], genre) => {
      const isChecked = this.form.get(genre)?.value;
      if (isChecked) {
        memo.push(`"${genre}"`);
      }
      return memo;
    }, []);
  }

  protected readonly FB_GENRES_TRANSLATED_STRUCTURED =
    FB_GENRES_TRANSLATED_STRUCTURED;
  protected readonly Object = Object;
  protected readonly FB2_GENRES_KEY_VALUE_SWAPPED =
    FB2_GENRES_KEY_VALUE_SWAPPED;
}
