import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OpenedBookService } from 'app/modules/player/services/opened-book.service';
import { BookData } from 'app/shared/model/fb2-book.types';
import { Fb2ReaderService } from 'app/shared/services/fb2-reader.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private fb2Service: Fb2ReaderService,
    private newBook: OpenedBookService,
    private router: Router
  ) {}

  public parseNewFile(files?: FileList): void {
    if (files && files.length > 0) {
      this.fb2Service.readBookFromFile(files[0]).then((bookData: BookData) => {
        this.newBook.update(bookData);
        this.router.navigateByUrl('/player');
      });
    } else {
      this.newBook.update({} as BookData);
    }
  }
}
