import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { ScrollbarDirective } from '@book-play/ui';
import NoSleep from 'nosleep.js';
import { fromEvent, merge, Subscription } from 'rxjs';
import { BookTitleComponent } from '../../../shared/components/book-title/book-title.component';
import { CopyrightOwnerComponent } from '../../../shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from '../../../shared/components/copyright/copyright.component';
import { MainHeaderComponent } from '../../../shared/components/main-header/main-header.component';
import { MainMenuComponent } from '../../../shared/components/main-menu/main-menu.component';
import {
  AppEventNames,
  EventsStateService,
} from '../../../shared/services/events-state.service';

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
    AsyncPipe,
    MatSidenav,
    MatSidenavContent,
    MatSidenavContainer,
    ScrollbarDirective,
  ],
})
export class MainComponent implements AfterViewInit, OnDestroy {
  public AppEvents = AppEventNames;
  public eventStatesService = inject(EventsStateService);

  private el = inject(ElementRef);
  private noSleep!: NoSleep;
  private noSleepSubscription!: Subscription;

  constructor() {
    effect(() => {
      const loading = this.eventStatesService.get(AppEventNames.loading)();

      if (loading) {
        this.el.nativeElement.classList.add('loading');
      } else {
        this.el.nativeElement.classList.remove('loading');
      }
    });
  }

  public ngAfterViewInit() {
    this.addListeners();
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
  }

  public ngOnDestroy() {
    this.noSleep.disable();
    this.noSleepSubscription.unsubscribe();
  }
}
