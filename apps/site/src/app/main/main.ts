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
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AudioCacheEffects } from '../shared/store/audio-cache/audio-cache.effects';
import { audioCacheReducers } from '../shared/store/audio-cache/audio-cache.reducers';
import { loadingReducer } from '../shared/store/loading/loading.reducer';
import { TtsEffects } from '../shared/store/tts/tts.effects';
import { ttsReducers } from '../shared/store/tts/tts.reducers';
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
        tts: ttsReducers,
        audioCache: audioCacheReducers,
      }),
      EffectsModule.forRoot([]),
      EffectsModule.forFeature([TtsEffects, AudioCacheEffects]),
      StoreDevtoolsModule.instrument()
    ),
  ],
}).catch((err) => console.error(err));
