import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainHeaderComponent } from '../../../modules/main-header/main-header.component';
import { MainMenuComponent } from '../../../modules/main-menu/main-menu.component';
import { BookTitleComponent } from '../../../shared/components/book-title/book-title.component';
import { CopyrightOwnerComponent } from '../../../shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from '../../../shared/components/copyright/copyright.component';
import {
  AppEventNames,
  EventsStateService,
} from '../../../shared/services/events-state.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    MainHeaderComponent,
    MainMenuComponent,
    RouterModule,
    CopyrightComponent,
    CopyrightOwnerComponent,
    BookTitleComponent,
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
