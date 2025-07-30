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
import { MatChip } from '@angular/material/chips';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { FB2_GENRE_UNIQUE_KEYS, FB2_GENRES } from '@book-play/constants';
import { AdvancedSearchParams, BasicBookData } from '@book-play/models';
import { StarRatingComponent, TagLinkComponent } from '@book-play/ui';
import { createQueryString, parseQueryString } from '@book-play/utils-common';
import { Store } from '@ngrx/store';
import { StarRatingModule } from 'angular-star-rating';
import { firstValueFrom } from 'rxjs';
import { BooksApiService } from '../../../../shared/services/books/books-api.service';
import {
  loadingEndAction,
  loadingStartAction,
} from '../../../../shared/store/loading/loading.action';

@Component({
  selector: 'books',
  imports: [
    CommonModule,
    TagLinkComponent,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatFabButton,
    ReactiveFormsModule,
    RouterLink,
    StarRatingModule,
    StarRatingComponent,
    MatInput,
    MatChip,
    MatExpansionModule,
  ],
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSearchComponent implements OnInit, AfterViewInit {
  private booksApiService = inject(BooksApiService);
  protected data: WritableSignal<BasicBookData[]> = signal([]);
  protected error: WritableSignal<any> = signal(null);
  private fb = inject(FormBuilder);
  protected form: FormGroup;
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  protected query = model<string | null>('');
  private searchResult = viewChild<ElementRef>('searchResult');
  private expansionPanel = viewChild(MatExpansionPanel);

  constructor() {
    this.form = this.fb.group({
      rating: [null, [Validators.min(0), Validators.max(10)]],
      ...Object.keys(FB2_GENRES).reduce(
        (memo: Record<string, any[]>, genreKey: string) => {
          memo[genreKey] = [false];
          return memo;
        },
        {}
      ),
    });
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
      this.expansionPanel()?.close();

      await this.fetchData();
      setTimeout(() =>
        this.searchResult()?.nativeElement.scrollIntoView(
          { block: 'start', behavior: 'smooth' },
          200
        )
      );
    }
  }

  private setFormValues(queryParams: Record<string, string>): void {
    const formValues: Record<string, any> = {};

    formValues['rating'] = queryParams['rating'];
    if (queryParams['genres']) {
      queryParams['genres'].split(',').forEach((genre: string) => {
        if (genre in this.form.value) {
          Object.assign(formValues, { [genre]: true });
        }
      });
    }

    this.form.patchValue(formValues);
  }

  private async fetchData() {
    this.store.dispatch(loadingStartAction());

    let data;
    try {
      if (this.query()) {
        data = await firstValueFrom(
          this.booksApiService.advancedSearch(this.query()!)
        );
      }
    } catch (e) {
      this.error.set(e);
    }

    if (data) {
      this.data.set(data);
    }
    this.store.dispatch(loadingEndAction());
  }

  protected async submit() {
    if (!this.form.valid) {
      return;
    }
    const params: AdvancedSearchParams = this.getFormParams();
    this.router.navigateByUrl(`/advanced-search/${createQueryString(params)}`);
  }

  protected unselectGenre($event: Event, genre: string) {
    $event.stopPropagation();
    this.form.patchValue({ [genre]: false });
  }

  protected getFormParams(): AdvancedSearchParams {
    const formValue = { ...this.form.value };
    const rating = formValue['rating'];

    delete formValue['rating'];

    const genres = Object.entries(formValue)
      .filter(([k, v]) => Boolean(v))
      .map(([k, v]) => k);

    return { rating, genres };
  }

  protected readonly Object = Object;
  protected readonly FB2_GENRES = FB2_GENRES;
  protected readonly FB2_GENRE_UNIQUE_KEYS = FB2_GENRE_UNIQUE_KEYS;
}
