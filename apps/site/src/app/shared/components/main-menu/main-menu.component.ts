import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ViewChild,
} from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/modules/material.module';
import { ActiveBookService } from 'app/modules/player/services/active-book.service';
import { UploadFileDirective } from 'app/shared/directives/file-upload/upload-file.directive';
import {
  AppEventNames,
  EventsStateService,
} from 'app/shared/services/events-state.service';
import { FileReaderService } from 'app/shared/services/file-reader.service';

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
