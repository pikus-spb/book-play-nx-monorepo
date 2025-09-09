import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'lib-color-picker',
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  host: {
    '[class.selected]': 'selected()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent {
  public color = input.required<string>();
  public value = input.required<string | number>();
  public title = input<string>('');
  public selected = signal<boolean>(false);
  public clicked = output<string | number>();

  protected onClick(): void {
    this.clicked.emit(this.value());
  }
}
