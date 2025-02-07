import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'canvas-skeleton',
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './canvas-skeleton.component.html',
  styleUrls: ['./canvas-skeleton.component.scss'],
})
export class CanvasSkeletonComponent {
  private themeBase = {
    'background-color': 'rgb(0 0 0 / 20%)',
    height: '0.5rem',
  };
  public themes = [
    { ...this.themeBase, ...{ width: '30%' } },
    this.themeBase,
    { ...this.themeBase, ...{ width: '20%' } },
    this.themeBase,
    { ...this.themeBase, ...{ width: '70%' } },
    { ...this.themeBase, ...{ width: '100%' } },
    { ...this.themeBase, ...{ width: '20%' } },
    this.themeBase,
    { ...this.themeBase, ...{ width: '30%' } },
    this.themeBase,
  ];
}
