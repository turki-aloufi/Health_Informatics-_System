import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorManagementComponent } from './components/admin/doctor-management/doctor-management.component';
import { DoctorFormComponent } from './components/admin/doctor-form/doctor-form.component';
import { DashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/doctor-management', component: DoctorManagementComponent },
  { path: 'admin/doctor-form', component: DoctorFormComponent },
  { path: 'admin/doctor-form/:id', component: DoctorFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
