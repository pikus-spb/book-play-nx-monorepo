import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RootComponent } from '../components/root/root.component';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './root.routing.module';

@NgModule({
  declarations: [RootComponent],
  bootstrap: [RootComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppRootModule {}
