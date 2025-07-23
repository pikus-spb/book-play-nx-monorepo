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
  Validators,
} from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import {
  FB_GENRES_TRANSLATIONS_STRUCTURED,
  isGenreGroup,
} from '@book-play/constants';
import { AdvancedSearchParams } from '@book-play/models';
import {
  ScrollbarDirective,
  StarRatingComponent,
  TagLinkComponent,
} from '@book-play/ui';
import { Store } from '@ngrx/store';
import { StarRatingModule } from 'angular-star-rating';
import { firstValueFrom, timer } from 'rxjs';
import { BooksApiService } from '../../../../shared/services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../../../../shared/store/loading/loading.action';
import { GenreInputGroupComponent } from '../genre-input-group/genre-input-group.component';

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
    GenreInputGroupComponent,
    StarRatingComponent,
    MatInput,
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
    this.form = this.fb.group({
      rating: [[Validators.min(0), Validators.max(10)]],
    });
  }
  protected async submit(event: Event) {
    if (!this.form.valid) {
      return;
    }

    this.store.dispatch(loadingStartAction());

    let data;
    try {
      const params: AdvancedSearchParams = this.getFormParams();

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

  private getFormParams(): AdvancedSearchParams {
    const formValue = this.form.value;
    const rating = formValue['rating'];

    delete formValue['rating'];

    const genres = Object.entries(formValue)
      .filter(([k, v]) => Boolean(v))
      .map(([k, v]) => k);

    return { rating, genres };
  }

  protected readonly FB_GENRES_TRANSLATED_STRUCTURED =
    FB_GENRES_TRANSLATIONS_STRUCTURED;
  protected readonly isGenreGroup = isGenreGroup;
  protected readonly Object = Object;
}
