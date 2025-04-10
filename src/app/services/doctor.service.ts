import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Appointment, AppointmentStatus } from '../models/appointment.model';
import { DoctorProfile } from '../models/doctor-profile.model';

export interface DashboardStats {
  todayAppointments: number;
  upcomingAppointments: number;
  completedThisWeek: number;
  patientsSeenThisMonth: number;
}
export interface Doctor {
  doctorId: number;
  name: string;
  specialty: string;
  clinic: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5098';
  private baseUrl = 'http://localhost:5098/api/Doctors'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/DoctorProfile/me`);
  }
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.baseUrl);
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/DoctorProfile/appointments/upcoming`);
  }

  getPastAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/DoctorProfile/appointments/past`);
  }

updateAppointmentNotes(appointmentId: string, notes: string): Observable<any> {
    console.log('Updating notes for appointment:', appointmentId, notes);
    return this.http.put(
      `${this.apiUrl}/api/DoctorProfile/appointments/public/${appointmentId}/notes`, 
      JSON.stringify(notes), 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  getPatientPastNotes(appointmentId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/DoctorProfile/appointments/public/${appointmentId}/patient-notes`
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      upcoming: this.getUpcomingAppointments(),
      past: this.getPastAppointments()
    }).pipe(
      map(result => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const todayAppointments = result.upcoming.filter(app => {
          const appDate = new Date(app.appointmentDateTime);
          return appDate >= today && appDate <= todayEnd;
        }).length;
        
        const upcomingAppointments = result.upcoming.length;
        
        const completedThisWeek = result.past.filter(app => {
          const appDate = new Date(app.appointmentDateTime);
          return app.status === AppointmentStatus.Completed && 
                 appDate >= startOfWeek && 
                 appDate <= today;
        }).length;
        
        const patientsThisMonth = result.past.filter(app => {
          const appDate = new Date(app.appointmentDateTime);
          return app.status === AppointmentStatus.Completed && 
                 appDate >= startOfMonth && 
                 appDate <= today;
        });
        
        const uniquePatientIds = new Set(patientsThisMonth.map(app => app.patientId));
        
        return {
          todayAppointments,
          upcomingAppointments,
          completedThisWeek,
          patientsSeenThisMonth: uniquePatientIds.size
        };
      }),
      catchError(error => {
        console.error('Error fetching dashboard stats', error);
        return of({
          todayAppointments: 0,
          upcomingAppointments: 0,
          completedThisWeek: 0,
          patientsSeenThisMonth: 0
        });
      })
    );
  }
// doctor.service.ts
updateAppointmentStatus(appointmentId: string, status: AppointmentStatus | number): Observable<any> {
  const statusValue = Number(status);
  return this.http.put(
    `${this.apiUrl}/api/DoctorProfile/appointments/public/${appointmentId}/status`,
    { status: statusValue }, 
    { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  );
}


}