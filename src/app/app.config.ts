// src/main.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component';
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component';
import { PatientManagementComponent } from './components/admin/patient-management/patient-management.component';
import { PatientFormComponent } from './components/admin/patient-form/patient-form.component';
import { DashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';

import { MyPreset } from '../assets/theme/mytheme';

import { authFeature } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { AuthInterceptor } from './core/interceptors/auth.interceptors';

import { patientReducer, patientFeatureKey } from './store/admin/patients/patient.reducer';
import { PatientEffects } from './store/admin/patients/patient.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide HttpClient with interceptor support
    provideHttpClient(withInterceptorsFromDi()),

    // Provide NgRx store and effects (for both auth and patients)
    provideStore({
      auth: authFeature.reducer,
      [patientFeatureKey]: patientReducer,
    }),
    provideEffects([AuthEffects, PatientEffects]),

    // Zone Change Detection and Client Hydration
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),

    // Routing configuration
    provideRouter(
      [
        { path: '', redirectTo: 'admin/patients', pathMatch: 'full' },
        { path: 'admin/doctor-management', component: DoctorManagementComponent },
        { path: 'admin/doctor-form', component: DoctorFormComponent },
        { path: 'admin/doctor-form/:id', component: DoctorFormComponent },
        { path: 'admin/patients', component: PatientManagementComponent },
        { path: 'admin/patient-form', component: PatientFormComponent },
        { path: 'admin/patient-form/:id', component: PatientFormComponent },
        { path: 'admin/dashboard', component: DashboardComponent },
        { path: 'auth/login', component: LoginComponent },
        { path: '**', redirectTo: '/admin/dashboard' },
      ],
      withComponentInputBinding()
    ),

    // Animations and UI configuration
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
    provideAngularSvgIcon(),

    // Register the AuthInterceptor for HTTP requests
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
