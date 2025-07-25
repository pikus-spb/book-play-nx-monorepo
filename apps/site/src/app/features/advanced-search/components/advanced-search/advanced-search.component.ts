import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  model,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
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
import { createQueryString, parseQueryString } from '@book-play/utils-common';
import { Store } from '@ngrx/store';
import { StarRatingModule } from 'angular-star-rating';
import { firstValueFrom, tap, timer } from 'rxjs';
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
export class AdvancedSearchComponent implements OnInit, AfterViewInit {
  private booksApiService = inject(BooksApiService);
  protected data: WritableSignal<any> = signal(null);
  protected error: WritableSignal<any> = signal(null);
  private fb = inject(FormBuilder);
  protected form: FormGroup;
  private store = inject(Store);
  private genresContainer = viewChild<ElementRef>('genresContainer');
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  protected query = model<string | null>('');

  constructor() {
    this.form = this.fb.group({
      rating: [null, [Validators.min(0), Validators.max(10)]],
      starRating: [],
    });

    this.form
      .get('rating')
      ?.valueChanges.pipe(
        tap((value: number) => {
          if (this.form.value.starRating !== value) {
            this.form.patchValue(
              { starRating: value },
              {
                emitEvent: false,
              }
            );
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.form
      .get('starRating')
      ?.valueChanges.pipe(
        tap((value: number) => {
          if (this.form.value.rating !== value) {
            this.form.patchValue(
              { rating: value },
              {
                emitEvent: false,
              }
            );
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initSearch();
        }
      });
  }

  public ngAfterViewInit(): void {
    this.initSearch();
  }

  private async initSearch() {
    this.query.set(this.route.snapshot.paramMap.get('search'));
    if (this.query()) {
      this.setFormValues(parseQueryString(this.query()!));
      await this.fetchData();

      this.genresContainer()?.nativeElement.removeAttribute('open');
    }
  }

  private setFormValues(queryParams: Record<string, string>): void {
    const formValues: Record<string, any> = {};

    if (queryParams['rating']) {
      formValues['rating'] = queryParams['rating'];
      formValues['starRating'] = queryParams['rating'];
    }

    if (queryParams['genres']) {
      queryParams['genres'].split(',').forEach((genre: string) => {
        Object.assign(formValues, { [genre]: true });
      });
    }

    this.form.patchValue(formValues);
  }

  private async fetchData() {
    this.store.dispatch(loadingStartAction());

    let data;
    try {
      data = await firstValueFrom(
        this.booksApiService.advancedSearch(this.query()!)
      );
    } catch (e) {
      this.error.set(e);
    }

    if (data) {
      this.data.set(data);
    }

    await firstValueFrom(timer(100));

    this.store.dispatch(loadingEndAction());
  }

  protected async submit(event: Event) {
    if (!this.form.valid) {
      return;
    }
    const params: AdvancedSearchParams = this.getFormParams();
    this.router.navigateByUrl(`/advanced-search/${createQueryString(params)}`);
    event.preventDefault();
  }

  private getFormParams(): AdvancedSearchParams {
    const formValue = this.form.value;
    const rating = formValue['rating'];

    delete formValue['rating'];
    delete formValue['starRating'];

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
