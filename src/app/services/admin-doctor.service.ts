import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from './../models/user.model';

interface ApiResponse<T> {
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = 'http://localhost:5098/api/AdminDoctors'; 

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/get-all-doctors`)
      .pipe(map(response => response.data));
  }

  getDoctor(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/get-doctor-by-id/${id}`)
      .pipe(map(response => response.data));
  }

  createDoctor(doctor: User): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/create-doctor`, doctor)
      .pipe(map(response => response.data));
  }

  updateDoctor(doctor: User): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/update-doctor/${doctor.id}`, doctor)
      .pipe(map(response => response.data));
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete-doctor/${id}`)
      .pipe(map(response => undefined));
  }
}