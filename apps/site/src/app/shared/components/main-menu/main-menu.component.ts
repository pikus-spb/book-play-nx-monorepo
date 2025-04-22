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
import { UploadFileDirective } from '../../directives/file-upload/upload-file.directive';
import { ActiveBookService } from '../../services/books/active-book.service';
import { FileReaderService } from '../../services/books/file-reader.service';
import { IndexedDbBookStorageService } from '../../services/books/indexed-db-book-storage.service';
import { EventsStateService } from '../../services/events-state.service';

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
  public activeBookService = inject(ActiveBookService);
  public activeBookPresent = computed(async () => {
    const book = this.activeBookService.book();

    if (book) {
      return true;
    } else {
      const data = await this.indexedDbStorageService.get();
      if (data && data.content.length > 0) {
        return true;
      }
    }

    return false;
  });

  private indexedDbStorageService = inject(IndexedDbBookStorageService);
  private fileReaderService = inject(FileReaderService);
  private eventStates = inject(EventsStateService);

  fileUploaded(files?: FileList) {
    this.fileReaderService.parseNewFile(files);
  }
}
