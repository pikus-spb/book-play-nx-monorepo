import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { ActiveBookService } from 'app/modules/player/services/active-book.service';
import {
  DBBookData,
  IndexedDbBookStorageService,
} from 'app/modules/player/services/indexed-db-book-storage.service';
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
  public eventStatesService = inject(EventsStateService);

  private indexedDbStorageService = inject(IndexedDbBookStorageService);
  private activeBookService = inject(ActiveBookService);
  private route = inject(ActivatedRoute);
  private routeParams = toSignal(this.route.paramMap);

  constructor() {
    effect(() => {
      // TODO: find a better place for this code
      const id = this.routeParams()?.get('id');
      if (!id) {
        this.indexedDbStorageService.get().then((data: DBBookData) => {
          if (data && data.content.length > 0) {
            const bookData = JSON.parse(data.content);
            this.activeBookService.update(bookData);
          }
        });
      }
    });

    effect(() => {
      // TODO: find a better place for this code
      if (this.activeBookService.book()) {
        this.indexedDbStorageService.set(
          JSON.stringify(this.activeBookService.book())
        );
      }
    });
  }
}
