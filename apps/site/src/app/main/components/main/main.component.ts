import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject
} from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { LoadingService } from '@book-play/services';

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
  ],
})

export class MainComponent {
  protected loading = inject(LoadingService).loading;


  @HostBinding('class.loading')
  get loadingState() {
    return this.loading();
  }
} 
