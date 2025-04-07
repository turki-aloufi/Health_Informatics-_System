import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DoctorService } from '../../../services/admin-doctor.service';
import { User } from '../../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { DoctorAvailability } from '../../../models/doctor-availability.model';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-doctor-management',
  template: `
    <p-card header="Doctors Management" styleClass="mb-4">
      <div class="mb-4 flex justify-between">
        <h2 class="text-xl font-semibold">Doctors List</h2>
        <p-button 
          label="Add Doctor" 
          icon="pi pi-plus" 
          (onClick)="navigateToForm()" 
          styleClass="p-button-rounded">
        </p-button>
      </div>
      
      <p-table 
        [value]="doctors" 
        [tableStyle]="{'min-width': '50rem'}"
        [paginator]="true" 
        [rows]="10"
        [showCurrentPageReport]="true"
        responsiveLayout="scroll"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} doctors"
        [rowsPerPageOptions]="[5,10,25]">
        <ng-template pTemplate="header">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialty</th>
            <th>Working Days</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-doctor let-i="rowIndex">
          <tr>
            <td>{{i + 1}}</td>
            <td>{{doctor.name}}</td>
            <td>{{doctor.email}}</td>
            <td>{{doctor.doctorProfile?.specialty}}</td>
            <td>{{getWorkingDays(doctor.doctorProfile?.availabilities)}}</td>
            <td>
              <div class="flex gap-2">
                <p-button 
                  icon="pi pi-pencil" 
                  (onClick)="navigateToForm(doctor.idPublic)" 
                  styleClass="p-button-sm p-button-info">
                </p-button>
                <p-button 
                  icon="pi pi-trash" 
                  (onClick)="confirmDelete(doctor)" 
                  styleClass="p-button-sm p-button-danger">
                </p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-4">
              No doctors found. Click "Add Doctor" to create one.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <p-toast></p-toast>
    <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>
  `,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    RouterModule, 
    CardModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class DoctorManagementComponent implements OnInit {
  doctors: User[] = [];
  loading = false;

  constructor(
    private doctorService: DoctorService, 
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.loading = true;
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.loading = false;
        console.log('Loaded doctors:', doctors);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load doctors: ' + error.message
        });
        console.error('Error loading doctors:', error);
      }
    });
  }

  navigateToForm(doctorId?: string) {
    if (doctorId) {
      this.router.navigate(['/admin/doctor-form', { id: doctorId }]);
    } else {
      this.router.navigate(['/admin/doctor-form']);
    }
  }

  confirmDelete(doctor: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Dr. ${doctor.name}?`,
      accept: () => {
        this.deleteDoctor(doctor);
      }
    });
  }

  deleteDoctor(doctor: User) {
    if (!doctor.idPublic) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Doctor ID is missing'
      });
      return;
    }

    this.doctorService.deleteDoctor(doctor.idPublic).subscribe({
      next: () => {
        this.doctors = this.doctors.filter(d => d.idPublic !== doctor.idPublic);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Dr. ${doctor.name} has been deleted`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete doctor: ' + error.message
        });
        console.error('Error deleting doctor:', error);
      }
    });
  }

  getWorkingDays(availabilities?: DoctorAvailability[]): string {
    if (!availabilities || availabilities.length === 0) return 'Not set';
    
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const days = availabilities.map(a => dayNames[a.dayOfWeek - 1]);
    
    return days.join(', ');
  }
}