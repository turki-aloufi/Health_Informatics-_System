import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { routes } from './app.routes'
import { MyPreset } from '../assets/theme/mytheme'
import { provideAngularSvgIcon } from 'angular-svg-icon'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideStore } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { authFeature } from './store/auth/auth.reducer'
import { AuthEffects } from './store/auth/auth.effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({ auth: authFeature.reducer }),
    provideEffects([AuthEffects]),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
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
    provideHttpClient(),
    provideAngularSvgIcon(),
  ],
}
