import { Routes } from '@angular/router'
import { LoginComponent } from './components/auth/login/login.component'
import { RegisterComponent } from './components/auth/register/register.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AppointmentBookingComponent } from './components/appointment-booking/appointment-booking.component'

export const routes: Routes = [
  {
    path: 'doctor',
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  {
    path: 'admin',
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  {
    path: 'patient',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'appointments/book', component: AppointmentBookingComponent },
      // Redirect patient root to appointment booking for now
      { path: '', redirectTo: 'appointments/book', pathMatch: 'full' }
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
]