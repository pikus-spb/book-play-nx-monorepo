import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { CopyrightOwnerComponent } from 'app/shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from 'app/shared/components/copyright/copyright.component';
import { MainHeaderComponent } from 'app/shared/components/main-header/main-header.component';
import { MainMenuComponent } from 'app/shared/components/main-menu/main-menu.component';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';

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
  constructor(public eventStatesService: EventsStateService) {}
}
