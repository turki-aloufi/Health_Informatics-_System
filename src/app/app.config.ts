// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { routes } from './app.routes';

import { AuthInterceptor } from './auth.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authFeature } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { PatientEffects } from './store/admin/patients/patient.effects';
import { patientReducer, patientFeatureKey } from './store/admin/patients/patient.reducer';
import { MyPreset } from '../assets/theme/mytheme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    provideStore({ auth: authFeature.reducer, [patientFeatureKey]: patientReducer }),
    provideEffects([AuthEffects, PatientEffects]),

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),

    provideRouter(routes, withComponentInputBinding()),

    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideAngularSvgIcon(),
  ],
};
