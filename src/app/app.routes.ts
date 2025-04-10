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

export const routes: Routes = [
  {
    path: 'doctor',
    children: [{ path: 'dashboard', component: AdminDashboardComponent }],
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
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'admin/patients', pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },

  { path: '**', redirectTo: '/admin/dashboard' },
]
