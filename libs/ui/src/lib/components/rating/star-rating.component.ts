import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';

@Component({
  selector: 'lib-star-rating',
  imports: [StarRatingModule, ReactiveFormsModule],
  templateUrl: './star-rating.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true,
    },
  ],
})
export class StarRatingComponent implements ControlValueAccessor {
  public rating = input.required<number>();
  public showLabel = input<boolean>(true);
  public formControlName = input<string>('');
}
