// src/app/components/admin/admin-appointment-form/admin-appointment-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminAppointmentsService, Appointment, AppointmentCreateDto } from '../../../services/admin-appointments.service';

@Component({
  standalone: true,
  selector: 'app-admin-appointment-form',
  template: `
    <p-card header="{{ id ? 'Edit Appointment' : 'Create Appointment' }}" styleClass="mb-4">
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="flex flex-col gap-4">
          <div>
            <label>Patient ID</label>
            <input type="number" [(ngModel)]="appointment.patientId" name="patientId" required class="w-full p-2 border">
          </div>
          <div>
            <label>Doctor ID</label>
            <input type="number" [(ngModel)]="appointment.doctorId" name="doctorId" required class="w-full p-2 border">
          </div>
          <div>
            <label>Date/Time</label>
            <input type="datetime-local" [(ngModel)]="appointmentDateTime" name="appointmentDateTime" required class="w-full p-2 border">
          </div>
          <div>
            <label>Status</label>
            <select [(ngModel)]="appointment.status" name="status" required class="w-full p-2 border">
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label>Notes</label>
            <textarea [(ngModel)]="appointment.notes" name="notes" class="w-full p-2 border"></textarea>
          </div>
          <div class="flex gap-2">
            <p-button type="submit" label="Save" [disabled]="!form.valid" styleClass="p-button-success"></p-button>
            <p-button label="Cancel" (onClick)="cancel()" styleClass="p-button-secondary"></p-button>
          </div>
        </div>
      </form>
    </p-card>
    <p-toast></p-toast>
  `,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService]
})
export class AdminAppointmentFormComponent implements OnInit {
  id: string | null = null;
  appointment: AppointmentCreateDto = {
    patientId: 0,
    doctorId: 0,
    appointmentDateTime: '',
    status: 'Scheduled', 
    notes: ''
  };
  appointmentDateTime: string = '';

  constructor(
    private adminAppointmentsService: AdminAppointmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.adminAppointmentsService.getAppointment(this.id).subscribe({
        next: (appointment) => {
          this.appointment = {
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            appointmentDateTime: appointment.appointmentDateTime,
            status: appointment.status, // Already a string from AdminAppointmentsController
            notes: appointment.notes
          };
          this.appointmentDateTime = this.formatDateTimeForInput(appointment.appointmentDateTime);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to load appointment: ${error.message}`
          });
        }
      });
    } else {
      this.appointmentDateTime = this.formatDateTimeForInput(new Date().toISOString());
    }
  }

  onSubmit() {
    this.appointment.appointmentDateTime = new Date(this.appointmentDateTime).toISOString();
    if (this.id) {
      this.adminAppointmentsService.updateAppointment(this.id, this.appointment).subscribe({
        next: () => this.onSuccess('updated'),
        error: (error) => this.onError('update', error)
      });
    } else {
      this.adminAppointmentsService.createAppointment(this.appointment).subscribe({
        next: () => this.onSuccess('created'),
        error: (error) => this.onError('create', error)
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin-appointments']);
  }

  private onSuccess(action: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Appointment ${action} successfully`
    });
    this.router.navigate(['/admin-appointments']);
  }

  private onError(action: string, error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to ${action} appointment: ${error.message}`
    });
  }

  private formatDateTimeForInput(isoString: string): string {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16); // For datetime-local input (YYYY-MM-DDTHH:MM)
  }
}