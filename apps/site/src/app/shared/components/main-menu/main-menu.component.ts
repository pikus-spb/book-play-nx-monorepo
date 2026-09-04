import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { BookPersistenceStorageService } from '@book-play/services';
import { UploadFileDirective } from '../../directives/file-upload/upload-file.directive';
import { ActiveBookService } from '../../services/active-book.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    UploadFileDirective,
    MatIcon,
    MatNavList,
    MatListItem,
  ],
})
export class MainMenuComponent {
  private activeBookService = inject(ActiveBookService);
  private bookPersistenceStorageService = inject(BookPersistenceStorageService);

  public activeBook = this.activeBookService.book;
  public activeBookPresent = signal(false);

  constructor() {
    effect(() => {
      if (this.activeBook()) {
        this.activeBookPresent.set(true);
      }
    });

    if (!this.activeBook()) {
      this.bookPersistenceStorageService
        .hasBook()
        .then((present) => {
          if (!this.activeBook()) {
            this.activeBookPresent.set(present);
          }
        });
    }
  }

  fileUploaded(files?: FileList) {
    if (files && files.length > 0) {
      this.activeBookService.importFromFile(files[0]);
    }
  }
}
