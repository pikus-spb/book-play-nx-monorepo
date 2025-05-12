import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { isDarkMode, listenDarkModeChange } from '@book-play/utils-browser';

@Component({
  selector: 'dark-mode-switcher',
  imports: [MatSlideToggle, MatIcon],
  templateUrl: './dark-mode-switcher.component.html',
  styleUrl: './dark-mode-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeSwitcherComponent implements OnInit {
  protected isDarkMode = signal(isDarkMode());
  private renderer = inject(Renderer2);

  protected toggleDarkMode(): void {
    this.isDarkMode.set(!this.isDarkMode());
    this.renderer.removeClass(
      document.body,
      this.isDarkMode() ? 'light' : 'dark'
    );
    this.renderer.addClass(document.body, this.isDarkMode() ? 'dark' : 'light');
  }

  public ngOnInit() {
    listenDarkModeChange((isDarkMode) => this.isDarkMode.set(isDarkMode));
  }
}
