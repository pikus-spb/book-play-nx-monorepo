import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Book } from '@book-play/models';
import {
  ActiveBookService,
  AppEventNames,
  EventsStateService,
  FileReaderService,
  IndexedDbBookStorageService,
} from '@book-play/services';
import { MaterialModule } from '../../../core/modules/material.module';
import { UploadFileDirective } from '../../directives/file-upload/upload-file.directive';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MaterialModule, UploadFileDirective],
})
export class MainMenuComponent implements OnInit {
  @ViewChild('uploadButton') uploadButton?: MatListItem;

  public activeBookService = inject(ActiveBookService);

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

  public ngOnInit() {
    this.indexedDbStorageService.get().then((data) => {
      if (data && data.content.length > 0) {
        const book = new Book(JSON.parse(data.content));
        this.activeBookService.update(book || null);
      }
    });
  }
}
