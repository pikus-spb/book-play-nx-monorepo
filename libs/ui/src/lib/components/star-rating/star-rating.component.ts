import { Component, effect, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';

@Component({
  selector: 'lib-star-rating',
  imports: [StarRatingModule, ReactiveFormsModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: StarRatingComponent,
      multi: true,
    },
  ],
})
export class StarRatingComponent implements ControlValueAccessor {
  public inputRating = input<number>(0, { alias: 'rating' });
  public readOnly = input<boolean>();
  public showLabel = input<boolean>(true);

  protected rating = signal<number>(0);
  protected disabled = signal<boolean>(false);
  protected onChange!: (value: number) => void;
  protected onTouched!: () => void;

  constructor() {
    effect(() => {
      const ratingValue = this.inputRating();
      if (ratingValue !== undefined) {
        this.rating.set(ratingValue / 2);
      }
    });
    effect(() => {
      const readOnlyValue = this.readOnly();
      if (readOnlyValue !== undefined) {
        this.disabled.set(readOnlyValue);
      }
    });
  }

  public writeValue(value: number): void {
    this.rating.set(value / 2);
  }

  public registerOnChange(fn: typeof this.onChange): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: typeof this.onTouched): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected setValue({ rating }: { rating: number }): void {
    if (this.rating() !== rating) {
      this.rating.set(rating);
      this.onChange(rating * 2);
    }
  }

  protected readonly Number = Number;
}
