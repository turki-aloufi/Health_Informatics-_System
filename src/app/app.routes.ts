// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Authentication Routes
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// Appointment Booking for patient
import { AppointmentBookingComponent } from './components/appointment-booking/appointment-booking.component';

// Admin management routes (from dev branch)
import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component';
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component';
import { DashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  // Default and authentication
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Doctor routes
  {
    path: 'doctor',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // ... other doctor-specific routes can be added here
    ],
  },

  // Patient routes
  {
    path: 'patient',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'appointments/book', component: AppointmentBookingComponent },
    ],
  },

  // Admin routes
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'doctor-management', component: DoctorManagementComponent },
      { path: 'doctor-form', component: DoctorFormComponent },
      { path: 'doctor-form/:id', component: DoctorFormComponent },
    ],
  },

  // Fallback route
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
