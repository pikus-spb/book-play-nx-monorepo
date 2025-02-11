import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  public createQueryParameters(options: Record<string, string>) {
    return Object.keys(options)
      .map((key: string) => `${key}=${options[key]}`)
      .join('&');
  }
}
