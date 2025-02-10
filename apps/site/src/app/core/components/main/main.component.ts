import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { CopyrightOwnerComponent } from 'app/shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from 'app/shared/components/copyright/copyright.component';
import { MainHeaderComponent } from 'app/shared/components/main-header/main-header.component';
import { MainMenuComponent } from 'app/shared/components/main-menu/main-menu.component';
import { ActiveBookService } from 'app/shared/services/active-book.service';
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
  public eventStatesService = inject(EventsStateService);

  private route = inject(ActivatedRoute);
  private activeBookService = inject(ActiveBookService);

  constructor() {
    if (this.route.firstChild) {
      this.activeBookService.setRouteSignal(
        toSignal(this.route.firstChild.paramMap)
      );
    }
  }
}
