import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { UploadFileDirective } from '../../directives/file-upload/upload-file.directive';
import { BookPersistenceStorageService } from '../../services/books/book-persistence-storage.service';
import { activeBookImportFromFileAction } from '../../store/active-book/active-book.actions';
import { activeBookSelector } from '../../store/active-book/active-book.selectors';

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
    AsyncPipe,
  ],
})
export class MainMenuComponent {
  private store = inject(Store);

  public activeBook = this.store.selectSignal(activeBookSelector);
  public activeBookPresent = computed(async () => {
    const book = this.activeBook();
    if (book) {
      return true;
    } else {
      const data = await this.bookPersistenceStorageService.get();
      if (data && data.content.length > 0) {
        return true;
      }
    }

    return false;
  });

  private bookPersistenceStorageService = inject(BookPersistenceStorageService);

  fileUploaded(files?: FileList) {
    if (files && files.length > 0) {
      this.store.dispatch(activeBookImportFromFileAction({ file: files[0] }));
    }
  }
}
