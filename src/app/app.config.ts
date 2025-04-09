// src/main.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component';
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component';
import { PatientManagementComponent } from './components/admin/patient-management/patient-management.component';
import { PatientFormComponent } from './components/admin/patient-form/patient-form.component';
import { PatientEffects } from './store/admin/patients/patient.effects';
import { patientReducer, patientFeatureKey } from './store/admin/patients/patient.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      [
        { path: '', redirectTo: '/admin/doctor-management', pathMatch: 'full' },
        { path: 'admin/doctor-management', component: DoctorManagementComponent },
        { path: 'admin/doctor-form', component: DoctorFormComponent },
        { path: 'admin/doctor-form/:id', component: DoctorFormComponent },
        { path: 'admin/patients', component: PatientManagementComponent },
        { path: 'admin/patient-form', component: PatientFormComponent },
        { path: 'admin/patient-form/:id', component: PatientFormComponent },
        { path: '**', redirectTo: '/admin/patients' },
      ],
      withComponentInputBinding()
    ),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideClientHydration(withEventReplay()),
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
    provideStore({
      [patientFeatureKey]: patientReducer, // Only patient reducer
    }),
    provideEffects([PatientEffects]), // Only patient effects
  ],
};