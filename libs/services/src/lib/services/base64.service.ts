import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Base64Service {
  public blobToBase64(blob: Blob): Observable<string> {
    return new Observable((subscriber) => {
      const reader = new FileReader();
      reader.onloadend = () => subscriber.next(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
}
