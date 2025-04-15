import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { loadingReducer } from '../shared/store/loading/loading.reducer';
import { MainComponent } from './components/main/main.component';
import { APP_ROUTES } from './model/app-routes';

bootstrapApplication(MainComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(APP_ROUTES),
    provideExperimentalZonelessChangeDetection(),
    importProvidersFrom(
      StoreModule.forRoot({
        loading: loadingReducer,
      }),
      StoreDevtoolsModule.instrument()
    ),
  ],
}).catch((err) => console.error(err));
