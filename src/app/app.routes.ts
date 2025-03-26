import { Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'

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
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
]
