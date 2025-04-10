  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { DoctorService } from '../../services/doctor.service';
  import { Appointment, AppointmentStatus } from '../../models/appointment.model';
  import { CardModule } from 'primeng/card';
  import { ButtonModule } from 'primeng/button';
  import { InputTextarea } from 'primeng/inputtextarea';
  import { ToastModule } from 'primeng/toast';
  import { MessageService } from 'primeng/api';
  import { LoadingComponent } from '../shared/loading';
  import { DividerModule } from 'primeng/divider';
  import { TagModule } from 'primeng/tag';

  @Component({
    selector: 'app-upcoming-appointments',
    standalone: true,
    imports: [
      CommonModule, 
      FormsModule, 
      CardModule, 
      ButtonModule, 
      InputTextarea, 
      ToastModule,
      LoadingComponent,
      DividerModule,
      TagModule
    ],
    providers: [MessageService],
    templateUrl: './upcoming-appointments.component.html'
  //   styleUrls: ['./upcoming-appointments.component.css']
  })

  export class UpcomingAppointmentsComponent implements OnInit {
    appointments: Appointment[] = [];
    loading = true;
    error = '';
    selectedAppointment?: Appointment;
    patientHistory: any[] = [];

    constructor(
      private doctorService: DoctorService,
      private messageService: MessageService
    ) {}
    getStatusText(status: number): string {
      switch (status) {
        case 0:
          return 'Scheduled';
        case 1:
          return 'Completed';
        case 2:
          return 'Cancelled';
        default:
          return 'Unknown';
      }
    }
    
    ngOnInit(): void {
      this.loadAppointments();
    }
    updateStatus(appointment: Appointment): void {
      if (!appointment.appointmentIdPublic) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Appointment ID is missing.'
        });
        return;
      }
    
      this.doctorService.updateAppointmentStatus(appointment.appointmentIdPublic, appointment.status)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Appointment status updated successfully.'
            });
            this.loadAppointments(); // refresh list
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update status: ' + (err.message || 'Unknown error')
            });
          }
        });
    }
    
    loadAppointments(): void {
      this.loading = true;
      this.doctorService.getUpcomingAppointments()
        .subscribe({
          next: (data) => {
            this.appointments = data;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load appointments: ' + (err.message || 'Unknown error');
            this.loading = false;
          }
        });
    }

    toggleNotes(appointment: Appointment): void {
      if (this.selectedAppointment === appointment) {
        this.selectedAppointment = undefined;
        this.patientHistory = [];
      } else {
        this.selectedAppointment = appointment;
      }
    }

  saveNotes(appointment: Appointment): void {
      if (!appointment.appointmentIdPublic) {
        console.error('Cannot save notes: appointmentIdPublic is missing');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save notes: Appointment ID is missing'
        });
        return;
      }
    
      this.doctorService.updateAppointmentNotes(appointment.appointmentIdPublic, appointment.notes || '')
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Notes saved successfully'
            });
          },
          error: (err) => {
            console.error('Error saving notes:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save notes: ' + (err.message || 'Unknown error')
            });
          }
        });
    }
    // Add to both appointment components
  getStatusDisplay(status: any): string {
      switch (Number(status)) {
        case 0: return 'Scheduled';
        case 1: return 'Completed';
        case 2: return 'Cancelled';
        default: return 'Unknown';
      }
    }
    viewPatientHistory(appointment: Appointment): void {
      this.doctorService.getPatientPastNotes(appointment.appointmentIdPublic as string)
        .subscribe({
          next: (data) => {
            this.patientHistory = data.notesHistory;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load patient history: ' + (err.message || 'Unknown error')
            });
          }
        });
    }

    getStatusSeverity(status: AppointmentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
      switch (status) {
        case AppointmentStatus.Scheduled:
          return 'success';
        case AppointmentStatus.Completed:
          return 'info';
        case AppointmentStatus.Cancelled:
          return 'danger';
        default:
          return 'secondary';
      }
    }
      
  }
