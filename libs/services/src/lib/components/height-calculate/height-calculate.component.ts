import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { HeightDelta } from '../../model/delta';
import { AppEventNames } from '../../services/events-state.service';
import { CalculateComponent } from './calculate.component';

@Component({
  selector: 'lib-height-calculate',
  imports: [CommonModule, CalculateComponent],
  templateUrl: './height-calculate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeightCalculateComponent implements OnInit {
  @Input() resizable!: HTMLElement;
  @Output() done = new EventEmitter<HeightDelta>();
  @ViewChild('child') child!: CalculateComponent;

  public run = signal<boolean>(false);

  constructor(el: ElementRef) {
    effect(() => {
      el.nativeElement.style.display = this.run() ? '' : 'none';
    });
  }

  public ngOnInit() {
    const resizeObserver = new ResizeObserver(() => {
      this.run.set(true);
    });
    resizeObserver.observe(this.resizable);
  }

  public calculationDone(delta: HeightDelta): void {
    this.done.emit(delta);
    this.run.set(false);
  }

  protected readonly AppEventNames = AppEventNames;
}
