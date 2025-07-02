import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Renderer2,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {
  DarkModeSwitcherComponent,
  KeepScreenOnComponent,
  ScrollbarDirective,
} from '@book-play/ui';
import { isDarkMode, listenDarkModeChange } from '@book-play/utils-browser';
import { Store } from '@ngrx/store';

import { BookTitleComponent } from '../../../shared/components/book-title/book-title.component';
import { CopyrightOwnerComponent } from '../../../shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from '../../../shared/components/copyright/copyright.component';
import { MainHeaderComponent } from '../../../shared/components/main-header/main-header.component';
import { MainMenuComponent } from '../../../shared/components/main-menu/main-menu.component';
import { AutoPlayService } from '../../../shared/services/tts/auto-play.service';
import { selectLoading } from '../../../shared/store/loading/loading.selector';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MainHeaderComponent,
    MainMenuComponent,
    RouterModule,
    CopyrightComponent,
    CopyrightOwnerComponent,
    BookTitleComponent,
    MatToolbar,
    MatProgressBar,
    MatSidenav,
    MatSidenavContent,
    MatSidenavContainer,
    ScrollbarDirective,
    DarkModeSwitcherComponent,
    KeepScreenOnComponent,
  ],
})
export class MainComponent implements AfterViewInit {
  private store = inject(Store);
  private renderer = inject(Renderer2);
  protected autoPlayService = inject(AutoPlayService);
  protected loading = toSignal(this.store.select(selectLoading));

  public ngAfterViewInit() {
    this.detectColorScheme(isDarkMode());
    this.addListeners();
  }

  @HostBinding('class.loading')
  get loadingState() {
    return this.loading();
  }

  private detectColorScheme(darkMode: boolean): void {
    this.renderer.removeClass(document.body, darkMode ? 'light' : 'dark');
    this.renderer.addClass(document.body, darkMode ? 'dark' : 'light');
  }

  private addListeners(): void {
    listenDarkModeChange((isDarkMode) => this.detectColorScheme(isDarkMode));
  }
}
