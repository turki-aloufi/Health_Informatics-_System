// app.routes.ts
import { Routes } from '@angular/router'
import { LoginComponent } from './components/auth/login/login.component'
import { RegisterComponent } from './components/auth/register/register.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DoctorDashboardComponent } from './components/doctor/doctor-dashboard.component'
import { DoctorProfileComponent } from './components/doctor/doctor-profile.component'
import { PastAppointmentsComponent } from './components/doctor/past-appointments.component'
import { UpcomingAppointmentsComponent } from './components/doctor/upcoming-appointments.component'

export const routes: Routes = [
  {
    path: 'doctor',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'profile', component: DoctorProfileComponent },
      { path: 'upcoming-appointments', component: UpcomingAppointmentsComponent },
      { path: 'past-appointments', component: PastAppointmentsComponent }
    ],
  },
  {
    path: 'admin',
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  {
    path: 'patient',
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
]