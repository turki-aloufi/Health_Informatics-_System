import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'

import { routes } from './app.routes'
import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component'
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component'
import { provideHttpClient } from '@angular/common/http'
import { provideClientHydration, withEventReplay } from '@angular/platform-browser'
import { AdminEffects } from './store/admin/admin.effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      { path: '', redirectTo: '/admin/doctor-management', pathMatch: 'full' }, // Default route
      { path: 'admin/doctor-management', component: DoctorManagementComponent },
      { path: 'admin/doctor-form', component: DoctorFormComponent },
      { path: 'admin/doctor-form/:id', component: DoctorFormComponent },
      { path: '**', redirectTo: '/admin/doctor-management' }, // Wildcard route
    ]),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
}
