// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './components/doctor/doctor-dashboard.component';
import { DoctorProfileComponent } from './components/doctor/doctor-profile.component';
import { PastAppointmentsComponent } from './components/doctor/past-appointments.component';
import { UpcomingAppointmentsComponent } from './components/doctor/upcoming-appointments.component';
import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component';
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component';
import { PatientManagementComponent } from './components/admin/patient-management/patient-management.component';
import { PatientFormComponent } from './components/admin/patient-form/patient-form.component';

export const routes: Routes = [
  {
    path: 'doctor',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'profile', component: DoctorProfileComponent },
      { path: 'upcoming-appointments', component: UpcomingAppointmentsComponent },
      { path: 'past-appointments', component: PastAppointmentsComponent },
    ],
  },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'doctor-management', component: DoctorManagementComponent },
      { path: 'doctor-form', component: DoctorFormComponent },
      { path: 'doctor-form/:id', component: DoctorFormComponent },
      { path: 'patients', component: PatientManagementComponent },
      { path: 'patient-form', component: PatientFormComponent },
      { path: 'patient-form/:id', component: PatientFormComponent },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
  {
    path: 'patient',
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'admin/dashboard' },
];
