import { NgTemplateOutlet } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-link',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './link.component.html',
})
export class LinkComponent {
  public libRouterLink: InputSignal<any[]> = input(['']);
  public title: InputSignal<string> = input('');
  public enabled: InputSignal<any> = input(true);
}
