import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  environment,
  UNBLOCK_HEADER_NAME,
} from '@book-play/constants';
import { Observable } from 'rxjs';

@Injectable()
export class UnblockContentInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const modifiedRequest = request.clone({
        setHeaders: {
          [UNBLOCK_HEADER_NAME]: environment.UNBLOCK_CONTENT_PASSWORD,
        },
      });
    return next.handle(modifiedRequest);
  }
}
