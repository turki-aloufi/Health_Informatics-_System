// src/main.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser'
import { provideStore } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { PatientEffects } from './store/admin/patients/patient.effects'
import {
  patientReducer,
  patientFeatureKey,
} from './store/admin/patients/patient.reducer'
import { routes } from './app.routes'

import { MyPreset } from '../assets/theme/mytheme'
import { provideAngularSvgIcon } from 'angular-svg-icon'

import { authFeature } from './store/auth/auth.reducer'
import { AuthEffects } from './store/auth/auth.effects'
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),

    provideStore({ auth: authFeature.reducer }),
    provideEffects([AuthEffects]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideClientHydration(),

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
    provideRouter(routes),

    provideStore({
      [patientFeatureKey]: patientReducer, // Only patient reducer
    }),
    provideEffects([PatientEffects]), // Only patient effects

    provideAngularSvgIcon(),
  ],
}
