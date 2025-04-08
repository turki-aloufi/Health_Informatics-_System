import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'

import { routes } from './app.routes'
import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component'
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component'
import { DashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component'
import { provideHttpClient } from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }, // Default route
      { path: 'admin/dashboard', component: DashboardComponent },
      { path: 'admin/doctor-management', component: DoctorManagementComponent },
      { path: 'admin/doctor-form', component: DoctorFormComponent },
      { path: 'admin/doctor-form/:id', component: DoctorFormComponent },
      { path: '**', redirectTo: '/admin/dashboard' }, // Wildcard route
    ]),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),

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