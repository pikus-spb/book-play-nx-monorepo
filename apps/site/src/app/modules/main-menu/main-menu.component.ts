import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../core/modules/material.module';
import { UploadFileDirective } from '../../shared/directives/file-upload/upload-file.directive';
import { ActiveBookService } from '../../shared/services/active-book.service';
import {
  AppEventNames,
  EventsStateService,
} from '../../shared/services/events-state.service';
import { FileReaderService } from '../../shared/services/file-reader.service';
import { IndexedDbBookStorageService } from '../../shared/services/indexed-db-book-storage.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MaterialModule, UploadFileDirective],
})
export class MainMenuComponent {
  @ViewChild('uploadButton') uploadButton?: MatListItem;

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

  constructor() {
    effect(() => {
      if (this.eventStates.get(AppEventNames.runUploadFile)()) {
        this.uploadButton?._elementRef.nativeElement.click();
      }
    });
  }

  fileUploaded(files?: FileList) {
    this.fileReaderService.parseNewFile(files);
  }
}
