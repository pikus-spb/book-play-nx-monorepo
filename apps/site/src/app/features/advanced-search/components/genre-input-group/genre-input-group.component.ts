import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FB2_GENRES, Fb2GenresGroup, isGenreGroup } from '@book-play/constants';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'genre-input-group',
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './genre-input-group.component.html',
  styleUrl: './genre-input-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreInputGroupComponent implements OnInit {
  public form = input<FormGroup>();
  public controlNames = input<string[] | Fb2GenresGroup>();
  public subgroup = input<boolean>(false);
  public name = input.required<string>();
  protected open?: Observable<boolean>;

  ngOnInit() {
    const group = this.controlNames();
    if (group !== undefined) {
      this.open = this.form()?.valueChanges.pipe(
        map((value) => {
          if (isGenreGroup(group)) {
            return Object.keys(group).some((key) => {
              return group[key].some((subkey) => {
                return value[subkey];
              });
            });
          } else {
            return group.some((key) => value[key]);
          }
        })
      );
    }
  }

  protected readonly FB2_GENRES = FB2_GENRES;
}
