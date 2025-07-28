import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FB_GENRES_STRUCTURED, isGenreGroup } from '@book-play/constants';
import { GenreInputGroupComponent } from '../genre-input-group/genre-input-group.component';

@Component({
  selector: 'genre-input-control',
  imports: [GenreInputGroupComponent],
  templateUrl: './genre-input-control.component.html',
  styleUrl: './genre-input-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreInputControlComponent {
  public form = input.required<FormGroup>();

  protected readonly FB_GENRES_STRUCTURED = FB_GENRES_STRUCTURED;
  protected readonly isGenreGroup = isGenreGroup;
  protected readonly Object = Object;
}
