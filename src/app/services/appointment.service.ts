import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:5098/api/Appointments'; // Change if your API base path is different

  constructor(private http: HttpClient) {}

  // Retrieve available slots for a doctor on a specific date.
  getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
    // Expecting date in yyyy-MM-dd format.
    const url = `${this.baseUrl}/available-slots/${doctorId}`;
    const params = new HttpParams().set('date', date);
    return this.http.get<string[]>(url, { params });
  }

  // Create a new appointment.
  createAppointment(appointmentData: { patientId: string; doctorId: number; appointmentDateTime: string; notes: string }): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, appointmentData);
  }
}
