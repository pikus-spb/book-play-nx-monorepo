import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UNBLOCK_CONTENT_COOKIE_NAME,
  UNBLOCK_HEADER_NAME,
} from '@book-play/constants';
import { getCookie } from '@book-play/utils-browser';

@Injectable()
export class UnblockContentInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const cookieValue = getCookie(UNBLOCK_CONTENT_COOKIE_NAME);
    let modifiedRequest = request;
    if (cookieValue) {
      modifiedRequest = request.clone({
        setHeaders: {
          [UNBLOCK_HEADER_NAME]: cookieValue,
        },
      });
    }
    return next.handle(modifiedRequest);
  }
}
