import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component'
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component'
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component'
import { LoginComponent } from './components/auth/login/login.component'
import { PatientFormComponent } from './components/admin/patient-form/patient-form.component'
import { PatientManagementComponent } from './components/admin/patient-management/patient-management.component'
import { RegisterComponent } from './components/auth/register/register.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AppointmentBookingComponent } from './components/appointment-booking/appointment-booking.component'
import { DoctorDashboardComponent } from './components/doctor/doctor-dashboard.component'
import { DoctorProfileComponent } from './components/doctor/doctor-profile.component'
import { UpcomingAppointmentsComponent } from './components/doctor/upcoming-appointments.component'
import { PastAppointmentsComponent } from './components/doctor/past-appointments.component'
import { PatientDashboardComponent } from './components/patient/patient-dashboard/patient-dashboard.component'

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
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'doctor-management', component: DoctorManagementComponent },
      { path: 'doctor-form', component: DoctorFormComponent },
      { path: 'doctor-form/:id', component: DoctorFormComponent },
      { path: 'patients', component: PatientManagementComponent },
      { path: 'patient-form', component: PatientFormComponent },
      { path: 'patient-form/:id', component: PatientFormComponent },
    ],
  },
  {
    path: 'patient',
    children: [
      { path: 'dashboard', component: PatientDashboardComponent },
      { path: 'booking', component: AppointmentBookingComponent },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'admin/patients', pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },

  { path: '**', redirectTo: '/admin/dashboard' },
]
