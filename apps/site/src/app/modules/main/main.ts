import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { APP_ROUTES } from './model/app-routes';

bootstrapApplication(RootComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
    provideExperimentalZonelessChangeDetection(),
  ],
}).catch((err) => console.error(err));
