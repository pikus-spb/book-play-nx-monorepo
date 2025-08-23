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
import { Router, RouterModule } from '@angular/router';
import { BookPersistenceStorageService } from '@book-play/services';
import { selectLoading } from '@book-play/store';
import { DarkModeSwitcherComponent } from '@book-play/ui';
import { isDarkMode, listenDarkModeChange } from '@book-play/utils-browser';
import { Store } from '@ngrx/store';

import { BookTitleComponent } from '../../../shared/components/book-title/book-title.component';
import { CopyrightOwnerComponent } from '../../../shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from '../../../shared/components/copyright/copyright.component';
import { MainHeaderComponent } from '../../../shared/components/main-header/main-header.component';
import { MainMenuComponent } from '../../../shared/components/main-menu/main-menu.component';

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
    DarkModeSwitcherComponent,
  ],
})
export class MainComponent implements AfterViewInit {
  private store = inject(Store);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  protected loading = toSignal(this.store.select(selectLoading));
  private bookPersistenceStorageService = inject(BookPersistenceStorageService);

  public ngAfterViewInit() {
    this.detectColorScheme(isDarkMode());
    this.addListeners();
    this.navigateToPlayerIfNeeded();
  }

  @HostBinding('class.loading')
  get loadingState() {
    return this.loading();
  }

  private async navigateToPlayerIfNeeded() {
    const data = await this.bookPersistenceStorageService.get();
    if (data && data.content.length > 0) {
      await this.router.navigateByUrl('/player');
    }
  }

  private detectColorScheme(darkMode: boolean): void {
    this.renderer.removeClass(document.body, darkMode ? 'light' : 'dark');
    this.renderer.addClass(document.body, darkMode ? 'dark' : 'light');
  }

  private addListeners(): void {
    listenDarkModeChange((isDarkMode) => this.detectColorScheme(isDarkMode));
  }
}
