import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ViewChild,
} from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import {
  ActiveBookService,
  AppEventNames,
  EventsStateService,
  FileReaderService,
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
export class MainMenuComponent {
  @ViewChild('uploadButton') uploadButton?: MatListItem;

  constructor(
    private fileReaderService: FileReaderService,
    private eventStates: EventsStateService,
    public openedBookService: ActiveBookService
  ) {
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
