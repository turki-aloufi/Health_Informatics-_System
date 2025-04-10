import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { AdminAppointmentsService, Appointment } from '../../../services/admin-appointments.service';

@Component({
  standalone: true,
  selector: 'app-admin-appointments',
  template: `
    <div class="h-screen">
      <p-card header="Appointments Management" styleClass="mb-4">
        <div class="mb-4 flex justify-between">
          <h2 class="text-xl font-semibold">Appointments List</h2>

        </div>

        <p-table
          [value]="appointments"
          [tableStyle]="{ 'min-width': '50rem' }"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          responsiveLayout="scroll"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments"
          [rowsPerPageOptions]="[5, 10, 25]"
          [loading]="loading"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date/Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-appointment let-i="rowIndex">
            <tr>
              <td>{{ i + 1 }}</td>
              <td>{{ appointment.patientName || 'Unknown' }}</td>
              <td>{{ appointment.doctorName || 'Unknown' }}</td>
              <td>{{ appointment.appointmentDateTime | date: 'medium' }}</td>
              <td>{{ appointment.status }}</td>
              <td>{{ appointment.notes || 'None' }}</td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    label="Edit"
                    icon="pi pi-pencil"
                    (onClick)="navigateToForm(appointment.appointmentIdPublic)"
                    styleClass="p-button-sm p-button-info"
                  ></p-button>
                  <p-button
                    label="Delete"
                    icon="pi pi-trash"
                    (onClick)="confirmDelete(appointment)"
                    styleClass="p-button-sm p-button-danger"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center p-4">
                No appointments found. Click "Add Appointment" to create one.
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <p-toast></p-toast>
      <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>
    </div>
  `,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    HttpClientModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;

  constructor(
    private adminAppointmentsService: AdminAppointmentsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.adminAppointmentsService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to load appointments: ${error.message}`
        });
      }
    });
  }

  navigateToForm(appointmentId?: string) {
    if (appointmentId) {
      this.router.navigate(['/admin/admin-appointment-form', { id: appointmentId }]);
    } else {
      this.router.navigate(['/admin/admin-appointment-form']);
    }
  }

  confirmDelete(appointment: Appointment) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the appointment for ${appointment.patientName || 'this patient'}?`,
      accept: () => this.deleteAppointment(appointment)
    });
  }

  deleteAppointment(appointment: Appointment) {
    if (!appointment.appointmentIdPublic) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Appointment ID is missing'
      });
      return;
    }

    this.adminAppointmentsService.deleteAppointment(appointment.appointmentIdPublic).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a.appointmentIdPublic !== appointment.appointmentIdPublic);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment deleted successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to delete appointment: ${error.message}`
        });
      }
    });
  }
}


