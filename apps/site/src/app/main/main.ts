import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';

import { MainComponent } from './components/main/main.component';
import { APP_ROUTES } from './routing/app-routes';
import { UnblockContentInterceptor } from './routing/http-interceptor/unblock-content.interceptor';

bootstrapApplication(MainComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
    provideZonelessChangeDetection(),
    provideAnimations(),
    importProvidersFrom(StarRatingModule.forRoot()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnblockContentInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
