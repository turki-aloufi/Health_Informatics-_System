import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = 'http://your-backend-api/doctors'; 

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getDoctor(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createDoctor(doctor: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, doctor);
  }

  updateDoctor(doctor: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${doctor.id}`, doctor);
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}