// app.routes.ts
import { Routes } from '@angular/router'
import { LoginComponent } from './components/auth/login/login.component'
import { RegisterComponent } from './components/auth/register/register.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DoctorDashboardComponent } from './components/doctor/doctor-dashboard.component'
<<<<<<< HEAD
=======
import { DoctorProfileComponent } from './components/doctor/doctor-profile.component'
>>>>>>> 41863276e51d8bc26fd77e8ccfc86b34594fe6d7

export const routes: Routes = [
  {
    path: 'doctor',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
<<<<<<< HEAD
      { path: 'dashboard', component: DoctorDashboardComponent }
=======
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'profile', component: DoctorProfileComponent }
>>>>>>> 41863276e51d8bc26fd77e8ccfc86b34594fe6d7
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