import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { routes } from './app.routes'
import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component'
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component'
import { DashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'
import { MyPreset } from '../assets/theme/mytheme'
import { provideAngularSvgIcon } from 'angular-svg-icon'
import { provideStore } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { authFeature } from './store/auth/auth.reducer'
import { AuthEffects } from './store/auth/auth.effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),

    provideStore({ auth: authFeature.reducer }),
    provideEffects([AuthEffects]),

    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'admin/dashboard', component: DashboardComponent },
      { path: 'admin/doctor-management', component: DoctorManagementComponent },
      { path: 'admin/doctor-form', component: DoctorFormComponent },
      { path: 'admin/doctor-form/:id', component: DoctorFormComponent },
      { path: '**', redirectTo: '/admin/dashboard' },
    ]),

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
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

    provideAngularSvgIcon(),
  ],
}
