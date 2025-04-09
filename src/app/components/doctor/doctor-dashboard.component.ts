// updated doctor-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DoctorService, DashboardStats } from '../../services/doctor.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    ProgressSpinnerModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  stats: DashboardStats = {
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedThisWeek: 0,
    patientsSeenThisMonth: 0
  };
  loading = true;
  todaysAppointments: any[] = [];
  loadingAppointments = true;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadTodaysAppointments();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.doctorService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard statistics'
        });
        this.loading = false;
      }
    });
  }

  loadTodaysAppointments(): void {
    this.loadingAppointments = true;
    this.doctorService.getUpcomingAppointments().subscribe({
      next: (appointments) => {
        // Filter to get only today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        
        this.todaysAppointments = appointments
          .filter(app => {
            const appDate = new Date(app.appointmentDateTime);
            return appDate >= today && appDate <= todayEnd;
          })
          .sort((a, b) => {
            return new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime();
          })
          .slice(0, 3); // Limit to 3 appointments for preview
        
        this.loadingAppointments = false;
      },
      error: (err) => {
        console.error('Error loading today\'s appointments', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load today\'s appointments'
        });
        this.loadingAppointments = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/doctor/${route}`]);
  }

  formatAppointmentTime(dateTime: Date | string): string {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Scheduled':
        return 'success';
      case 'Completed':
        return 'info';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}