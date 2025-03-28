import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-tag-link',
  imports: [MatChip, RouterLink],
  templateUrl: './tag-link.component.html',
  styleUrl: './tag-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagLinkComponent {
  public value = input<string>();
  public linkPrefix = input<string>();
}
