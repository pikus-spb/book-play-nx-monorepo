import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInput } from '@angular/material/input';
import { FB2_GENRE_UNIQUE_KEYS, FB2_GENRES } from '@book-play/constants';
import { debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'genres-list-filter',
  imports: [MatInput],
  templateUrl: './genres-list-filter.component.html',
  styleUrl: './genres-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresListFilterComponent implements OnInit {
  public genres = input.required<WritableSignal<string[]>>();
  protected input = viewChild<ElementRef>('input');
  private destroyRef = inject(DestroyRef);

  public ngOnInit() {
    fromEvent(this.input()?.nativeElement, 'input')
      .pipe(
        distinctUntilChanged(),
        debounceTime(100),
        tap((event) => {
          this.filterGenres(event as Event);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected filterGenres(event: Event) {
    this.genres().set(
      FB2_GENRE_UNIQUE_KEYS.filter((key) => {
        const query = (event.target as HTMLInputElement).value;
        return FB2_GENRES[key].toLowerCase().match(query.toLowerCase());
      })
    );
  }
}
