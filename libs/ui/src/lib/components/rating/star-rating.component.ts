import { Component, input } from '@angular/core';
import { StarRatingModule } from 'angular-star-rating';

@Component({
  selector: 'lib-star-rating',
  imports: [StarRatingModule],
  templateUrl: './star-rating.component.html',
})
export class StarRatingComponent {
  public rating = input.required<number>();
  public showLabel = input<boolean>(true);
  protected readonly Number = Number;
  protected readonly String = String;
  protected readonly top = top;
}
