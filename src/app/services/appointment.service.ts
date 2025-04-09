// src/app/services/appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppointmentCreateDto {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5098/api/Appointments';

  constructor(private http: HttpClient) {}

  // Updated to return Observable<string[]> since the API returns date-time strings.
  getAvailableTimeSlots(doctorId: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/available-slots/${doctorId}?date=${date}`);
  }

  createAppointment(appointmentData: AppointmentCreateDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointmentData);
  }

  getMyAppointments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }
}
