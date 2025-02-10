import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { ActiveBookService } from 'app/modules/player/services/active-book.service';
import { CopyrightOwnerComponent } from 'app/shared/components/copyright-owner/copyright-owner.component';
import { CopyrightComponent } from 'app/shared/components/copyright/copyright.component';
import { MainHeaderComponent } from 'app/shared/components/main-header/main-header.component';
import { MainMenuComponent } from 'app/shared/components/main-menu/main-menu.component';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';
import { tap } from 'rxjs';

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
  private idSignal: WritableSignal<string | null> = signal(null);
  private activeBookService = inject(ActiveBookService);

  constructor() {
    this.route.firstChild?.paramMap
      .pipe(
        takeUntilDestroyed(),
        tap((params) => {
          this.idSignal.set(params.get('id'));
        })
      )
      .subscribe();
    this.activeBookService.setRouteParamSignal(this.idSignal);
  }
}
