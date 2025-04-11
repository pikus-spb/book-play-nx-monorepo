import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { APP_ROUTES } from './model/app-routes';

bootstrapApplication(MainComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
    provideExperimentalZonelessChangeDetection(),
  ],
}).catch((err) => console.error(err));
