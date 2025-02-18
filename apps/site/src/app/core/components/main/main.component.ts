import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppEventNames, EventsStateService } from '@book-play/services';
import { MainHeaderComponent } from '../../../modules/main-header/main-header.component';
import { MainMenuComponent } from '../../../modules/main-menu/main-menu.component';
import { CopyrightOwnerComponent } from '../../../shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from '../../../shared/components/copyright/copyright.component';
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
  ],
})
export class MainComponent {
  public AppEvents = AppEventNames;
  public eventStatesService = inject(EventsStateService);
}
