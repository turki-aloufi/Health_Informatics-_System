// src/app/services/admin-patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Gender, UserRole } from '../models/user.model';
import { PatientProfile } from '../models/patient-profile.model';

interface ApiResponse<T> {
  msg: string;
  data: T;
}

interface CreatePatientResponse {
  message: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:5098/api/AdminPatients';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxMCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwiZXhwIjoxNzQ0MTg0NjE3LCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.UrzR1sO8sRL4hFKegRXTk4OhfjNJnPfIsvNiqxGU-ek'}`,
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Full HTTP Error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.status !== undefined) {
      errorMessage = `Server error: HTTP ${error.status} - ${error.statusText}`;
      if (error.error) {
        errorMessage += ` | Details: ${JSON.stringify(error.error)}`;
      }
    } else {
      errorMessage = `Network or configuration error: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getPatients(): Observable<User[]> {
    console.log('Fetching patients from:', `${this.apiUrl}/get-all-patients`);
    return this.http
      .get<ApiResponse<any[]>>(`${this.apiUrl}/get-all-patients`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Response:', response);
          return response.data.map((p) => ({
            idPublic: p.idPublic,
            name: p.name,
            email: p.email,
            role: p.role as UserRole,
            doB: new Date(p.doB),
            ssn: p.ssn,
            gender: p.gender as Gender,
            phoneNumber: p.phoneNumber,
            address: p.address,
            patientProfile: {
              medicalHistory: p.medicalHistory,
              insuranceDetails: p.insuranceDetails,
              emergencyContact: p.emergencyContact,
            } as PatientProfile,
          } as User));
        }),
        catchError(this.handleError)
      );
  }

  createPatient(patientData: any): Observable<User> {
    const url = 'http://localhost:5098/api/Auth/create-patient-profile';
    console.log('Creating patient at:', url, 'with data:', patientData);
    return this.http
      .post<CreatePatientResponse>(url, patientData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((response) => {
          console.log('Create response:', response);
          return {
            idPublic: response.userId.toString(),
            name: patientData.name,
            email: patientData.email,
            password: patientData.password,
            role: UserRole.Patient,
            doB: new Date(patientData.doB),
            ssn: patientData.ssn,
            gender: patientData.gender === 0 ? Gender.Male : Gender.Female,
            phoneNumber: patientData.phoneNumber,
            address: patientData.address,
            patientProfile: {
              medicalHistory: '',
              insuranceDetails: '',
              emergencyContact: '',
            } as PatientProfile,
          } as User;
        }),
        catchError(this.handleError)
      );
  }

  updatePatient(id: string, patientData: any): Observable<User> {
    const url = `${this.apiUrl}/update-patient/${id}`;
    console.log('Updating patient at:', url, 'with data:', patientData);
    return this.http
      .put<ApiResponse<any>>(url, patientData, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Update response:', response);
          const p = response.data;
          return {
            idPublic: id, // Use the provided ID
            name: p.name,
            email: p.email,
            role: UserRole.Patient,
            doB: new Date(p.doB),
            ssn: p.ssn,
            gender: p.gender === 0 ? Gender.Male : Gender.Female,
            phoneNumber: p.phoneNumber,
            address: p.address,
            patientProfile: {
              medicalHistory: p.medicalHistory,
              insuranceDetails: p.insuranceDetails,
              emergencyContact: p.emergencyContact,
            } as PatientProfile,
          } as User;
        }),
        catchError(this.handleError)
      );
  }

  deletePatient(id: string): Observable<void> {
    console.log('Deleting patient at:', `${this.apiUrl}/delete-patient/${id}`);
    return this.http
      .delete<void>(`${this.apiUrl}/delete-patient/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}