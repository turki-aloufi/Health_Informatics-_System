import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoadingComponent } from '../shared/loading';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-past-appointments',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    ToastModule,
    LoadingComponent,
    DividerModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './past-appointments.component.html'
//   styleUrls: ['./past-appointments.component.css']
})
export class PastAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  error = '';
  selectedAppointment?: Appointment;

  constructor(
    private doctorService: DoctorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.doctorService.getPastAppointments()
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
    this.selectedAppointment = this.selectedAppointment === appointment ? undefined : appointment;
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
  // Add to both appointment components
getStatusDisplay(status: any): string {
    switch (Number(status)) {
      case 0: return 'Scheduled';
      case 1: return 'Completed';
      case 2: return 'Cancelled';
      default: return 'Unknown';
    }
  }
}