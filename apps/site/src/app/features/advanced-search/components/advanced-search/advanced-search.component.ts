import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  resource,
  viewChild,
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
import { FB2_GENRES } from '@book-play/constants';
import { AdvancedSearchParams } from '@book-play/models';
import { BooksApiService } from '@book-play/services';
import { loadingEndAction, loadingStartAction } from '@book-play/store';
import { BooksListComponent, StarRatingComponent } from '@book-play/ui';
import { createQueryString, parseQueryString } from '@book-play/utils-common';
import { Store } from '@ngrx/store';
import { StarRatingModule } from 'angular-star-rating';
import { firstValueFrom } from 'rxjs';
import { GenresFilterControlComponent } from '../genres-filter-control/genres-filter-control.component';
import { maxGenresSelectedValidator } from '../../form-validator/max-genres-selected.validator';

@Component({
  selector: 'books',
  imports: [
    CommonModule,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatFabButton,
    ReactiveFormsModule,
    RouterLink,
    StarRatingModule,
    StarRatingComponent,
    MatInput,
    GenresFilterControlComponent,
    BooksListComponent,
  ],
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSearchComponent implements AfterViewInit {
  private booksApiService = inject(BooksApiService);
  protected data = resource({
    params: () => (this.query() !== '' ? this.query() : undefined),
    loader: async ({ params }) => {
      this.store.dispatch(loadingStartAction());
      const result = await firstValueFrom(
        this.booksApiService.advancedSearch(params)
      );
      this.store.dispatch(loadingEndAction());
      return result;
    },
  });
  private fb = inject(FormBuilder);
  protected form: FormGroup;
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  protected query = model<string>('');
  private genresControl = viewChild(GenresFilterControlComponent);

  constructor() {
    this.form = this.fb.group({
      rating: [null, [Validators.min(0), Validators.max(10)]],
      genres: this.fb.group(
        {
          ...Object.keys(FB2_GENRES).reduce(
            (memo: Record<string, boolean[]>, genreKey: string) => {
              memo[genreKey] = [false];
              return memo;
            },
            {}
          ),
        },
        { validators: maxGenresSelectedValidator(3) }
      ),
    });

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

  protected get genresGroup(): FormGroup {
    return this.form.get('genres') as FormGroup;
  }

  private initSearch() {
    this.query.set(this.route.snapshot.paramMap.get('search') ?? '');
    if (this.query()) {
      this.setFormValues(parseQueryString(this.query()));
      this.genresControl()?.close();
    }
  }

  private setFormValues(queryParams: Record<string, string>): void {
    if (queryParams['rating'] !== null) {
      this.form.patchValue({ rating: queryParams['rating'] });
    }

    if (queryParams['genres']) {
      if (this.genresGroup) {
        queryParams['genres'].split(',').forEach((genre: string) => {
          if (genre in this.genresGroup.value) {
            this.genresGroup.patchValue({ [genre]: true });
          }
        });
      }
    }
  }

  protected async submit() {
    if (!this.form.valid) {
      return;
    }
    const params: AdvancedSearchParams = this.getFormParams();
    this.router.navigateByUrl(`/advanced-search/${createQueryString(params)}`);
  }

  protected getFormParams(): AdvancedSearchParams {
    const rating = this.form.value['rating'];

    const formValue = this.genresGroup.value;
    let genres: string[] = [];
    if (formValue) {
      genres = Object.entries(formValue)
        .filter(([k, v]) => Boolean(v))
        .map(([k, v]) => k);
    }

    return { rating, genres };
  }

  protected readonly Object = Object;
}
