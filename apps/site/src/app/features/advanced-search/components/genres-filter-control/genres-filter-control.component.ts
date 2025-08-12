import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import {
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { FB2_GENRE_UNIQUE_KEYS, FB2_GENRES } from '@book-play/constants';
import { map, Observable, tap } from 'rxjs';
import { GenresListFilterComponent } from '../genres-list-filter/genres-list-filter.component';

@Component({
  selector: 'genres-filter-control',
  imports: [
    MatChip,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    ReactiveFormsModule,
    MatExpansionModule,
    GenresListFilterComponent,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './genres-filter-control.component.html',
  styleUrl: './genres-filter-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresFilterControlComponent implements OnInit {
  public form = input.required<FormGroup>();
  protected selectedGenres$?: Observable<string[]>;
  protected genreKeys = signal(FB2_GENRE_UNIQUE_KEYS);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.selectedGenres$ = this.form().valueChanges.pipe(
      map((formValue) => {
        return Object.entries(formValue)
          .filter(([k, v]) => Boolean(v))
          .map(([k, v]) => k);
      }),
      tap(() => {
        setTimeout(() => this.cd.markForCheck(), 300);
      })
    );
  }

  protected unselectGenre($event: Event, genre: string) {
    $event.stopPropagation();
    this.form().patchValue({ [genre]: false });
  }

  protected readonly FB2_GENRES = FB2_GENRES;
}
