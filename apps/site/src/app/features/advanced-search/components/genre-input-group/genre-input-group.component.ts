import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FB2_GENRES } from '@book-play/constants';

@Component({
  selector: 'genre-input-group',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './genre-input-group.component.html',
  styleUrl: './genre-input-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreInputGroupComponent implements OnInit {
  public formGroup = input.required<FormGroup>();
  public controlNames = input.required<string[]>();

  public ngOnInit() {
    this.controlNames().forEach((name) => {
      this.formGroup().addControl(name, new FormControl(''));
    });
  }

  protected readonly FB2_GENRES = FB2_GENRES;
}
