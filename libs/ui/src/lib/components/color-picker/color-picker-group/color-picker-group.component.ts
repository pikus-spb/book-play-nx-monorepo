import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  DestroyRef,
  inject,
  OnChanges,
  signal,
  SimpleChanges,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'lib-color-picker-group',
  imports: [],
  templateUrl: './color-picker-group.component.html',
  styleUrl: './color-picker-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ColorPickerGroupComponent,
      multi: true,
    },
  ],
})
export class ColorPickerGroupComponent
  implements AfterViewInit, ControlValueAccessor
{
  public title = signal<string>('');

  protected onChange!: (value: number | string) => void;
  protected onTouched!: () => void;

  private items = contentChildren(ColorPickerComponent);

  ngAfterViewInit(): void {
    this.items().forEach((item) => {
      item.clicked.subscribe((value) => {
        this.writeValue(value);
        this.onTouched();
        this.onChange(value);
      });
    });
  }

  writeValue(value: number | string): void {
    this.items().forEach((item) => {
      if (item.value() === value) {
        this.title.set(item.title() || '');
        item.selected.set(true);
      } else {
        item.selected.set(false);
      }
    });
  }

  public registerOnChange(fn: typeof this.onChange): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: typeof this.onTouched): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    // Not implemented
  }
}
