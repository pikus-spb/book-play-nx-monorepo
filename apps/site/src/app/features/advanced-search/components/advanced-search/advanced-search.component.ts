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
  FormControl,
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
  FB2_GENRES_ALIASES,
  FB_GENRES_STRUCTURED_ARRAY,
} from '@book-play/constants';
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
import { GenreInputControlComponent } from '../genre-input-control/genre-input-control.component';

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
    GenreInputControlComponent,
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

  constructor() {
    this.form = this.fb.group({
      rating: [null, [Validators.min(0), Validators.max(10)]],
    });
    FB_GENRES_STRUCTURED_ARRAY.forEach((name) => {
      this.form.addControl(name, new FormControl(''));
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

    if (!isNaN(parseFloat(queryParams['rating']))) {
      formValues['rating'] = queryParams['rating'];
    }
    if (queryParams['genres']) {
      queryParams['genres'].split(',').forEach((genre: string) => {
        if (genre in this.form.value) {
          Object.assign(formValues, { [genre]: true });
        } else if (FB2_GENRES_ALIASES[genre] !== undefined) {
          const alias = FB2_GENRES_ALIASES[genre].find(
            (alias) => alias in this.form.value
          );
          if (alias) {
            Object.assign(formValues, { [alias]: true });
          }
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

  protected async submit(event: Event) {
    if (!this.form.valid) {
      return;
    }
    const params: AdvancedSearchParams = this.getFormParams();
    this.router.navigateByUrl(`/advanced-search/${createQueryString(params)}`);
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

  protected readonly Object = Object;
}
