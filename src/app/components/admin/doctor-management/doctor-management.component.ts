import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DoctorService } from '../../../services/admin-doctor.service';
import { User } from '../../../models/user.model';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DoctorAvailability } from '../../../models/doctor-availability.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-doctor-management',
  template: `
    <h1>Doctors List</h1>
    <p-button label="Add Doctor" (onClick)="navigateToForm()" styleClass="p-button-rounded"></p-button>
    <p-table [value]="doctors" [tableStyle]="{'min-width': '50rem'}">
      <ng-template pTemplate="header">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Specialty</th>
          <th>Working Days</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-doctor let-i="rowIndex">
        <tr>
          <td>{{i + 1}}</td>
          <td>{{doctor.name}}</td>
          <td>{{doctor.doctorProfile?.specialty}}</td>
          <td>{{getWorkingDays(doctor.doctorProfile?.availabilities)}}</td>
          <td>
            <p-button label="Details" (onClick)="navigateToForm(doctor.id)" styleClass="p-button-sm p-button-info"></p-button>
            <p-button label="Delete" (onClick)="deleteDoctor(doctor.id)" styleClass="p-button-sm p-button-danger"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  imports: [CommonModule, TableModule, ButtonModule, RouterOutlet, RouterModule, ReactiveFormsModule],
})
export class DoctorManagementComponent implements OnInit {
  doctors: User[] = [];

  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit() {
    this.doctorService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
    });
  }

  navigateToForm(doctorId?: string) {
    this.router.navigate(['/admin/doctor-form', { id: doctorId }]);
  }

  deleteDoctor(doctorId?: string) {
    if (doctorId && confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(doctorId).subscribe(() => {
        this.doctors = this.doctors.filter((d) => d.id !== doctorId);
      });
    }
  }

  getWorkingDays(availabilities?: DoctorAvailability[]): string {
    return availabilities?.map((a) => a.dayOfWeek).join(', ') || 'N/A';
  }
}