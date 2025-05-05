import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  inject,
  OnDestroy,
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

import { ScrollbarDirective } from '@book-play/ui';
import { Store } from '@ngrx/store';
import NoSleep from 'nosleep.js';
import { fromEvent, merge, Subscription } from 'rxjs';
import { BookTitleComponent } from '../../../shared/components/book-title/book-title.component';
import { CopyrightOwnerComponent } from '../../../shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from '../../../shared/components/copyright/copyright.component';
import { MainHeaderComponent } from '../../../shared/components/main-header/main-header.component';
import { MainMenuComponent } from '../../../shared/components/main-menu/main-menu.component';
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
  ],
})
export class MainComponent implements AfterViewInit, OnDestroy {
  private store = inject(Store);
  private renderer = inject(Renderer2);
  protected loading = toSignal(this.store.select(selectLoading));
  private el = inject(ElementRef);
  private noSleep!: NoSleep;
  private noSleepSubscription!: Subscription;

  public ngAfterViewInit() {
    this.detectColorScheme();
    this.addListeners();
  }

  @HostBinding('class.loading')
  get loadingState() {
    return this.loading();
  }

  private detectColorScheme(): void {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    this.renderer.removeClass(document.body, isDarkMode ? 'light' : 'dark');
    this.renderer.addClass(document.body, isDarkMode ? 'dark' : 'light');
  }

  private addListeners(): void {
    // Touch enables no sleep
    if (!this.noSleep) {
      this.noSleep = new NoSleep();
    }
    this.noSleepSubscription = merge(
      fromEvent(this.el.nativeElement, 'click'),
      fromEvent(this.el.nativeElement, 'touchend')
    ).subscribe(() => {
      this.noSleep.enable();
      this.noSleepSubscription.unsubscribe();
    });

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        this.detectColorScheme();
      });
  }

  public ngOnDestroy() {
    this.noSleep.disable();
    this.noSleepSubscription.unsubscribe();
  }
}
