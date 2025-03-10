import { Observable } from 'rxjs';

export function blobToBase64(blob: Blob): Observable<string> {
  return new Observable((subscriber) => {
    const reader = new FileReader();
    reader.onloadend = () => subscriber.next(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
