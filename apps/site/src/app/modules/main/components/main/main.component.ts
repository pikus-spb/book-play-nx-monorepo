import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
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

import { BookTitleComponent } from '../../../../shared/components/book-title/book-title.component';
import { CopyrightOwnerComponent } from '../../../../shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from '../../../../shared/components/copyright/copyright.component';
import { MainHeaderComponent } from '../../../../shared/components/main-header/main-header.component';
import { MainMenuComponent } from '../../../../shared/components/main-menu/main-menu.component';
import {
  AppEventNames,
  EventsStateService,
} from '../../../../shared/services/events-state.service';

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
export class MainComponent {
  public AppEvents = AppEventNames;
  public eventStatesService = inject(EventsStateService);

  constructor() {
    effect(() => {
      const loading = this.eventStatesService.get(AppEventNames.loading)();

      if (loading) {
        document.body.classList.add('loading');
      } else {
        document.body.classList.remove('loading');
      }
    });
  }
}
