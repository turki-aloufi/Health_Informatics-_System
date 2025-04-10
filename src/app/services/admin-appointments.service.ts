// // src/app/services/admin-appointments.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

// export interface Appointment {
//   appointmentId: number;
//   appointmentIdPublic: string;
//   patientId: number;
//   doctorId: number;
//   appointmentDateTime: string; // ISO string from backend
//   status: 'Scheduled' | 'Completed' | 'Cancelled';
//   notes?: string;
//   patientProfile?: { user: { name: string } }; // Simplified for display
//   doctorProfile?: { user: { name: string } };
// }

// export interface AppointmentCreateDto {
//   patientId: number;
//   doctorId: number;
//   appointmentDateTime: string;
//   status: 'Scheduled' | 'Completed' | 'Cancelled';
//   notes?: string;
// }

// interface ApiResponse<T> {
//   msg: string;
//   data: T;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminAppointmentsService {
//   private apiUrl = 'http://localhost:5098/api/AdminAppointments';

//   constructor(private http: HttpClient) {}

//   private getHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token') || 
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxMCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwiZXhwIjoxNzQ0MjcyNTYyLCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.iPCeIViK7Ox490pagkwTI-S7P7me8iDNxLyRmE_XFqg';
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     });
//   }

//   private handleError(error: HttpErrorResponse): Observable<never> {
//     console.error('Full HTTP Error:', error);
//     let errorMessage = 'An unknown error occurred';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Client-side error: ${error.error.message}`;
//     } else if (error.status !== undefined) {
//       errorMessage = `Server error: HTTP ${error.status} - ${error.statusText}`;
//       if (error.error) {
//         errorMessage += ` | Details: ${JSON.stringify(error.error)}`;
//       }
//     } else {
//       errorMessage = `Network or configuration error: ${error.message}`;
//     }
//     return throwError(() => new Error(errorMessage));
//   }

//   getAppointments(): Observable<Appointment[]> {
//     console.log('Fetching appointments from:', `${this.apiUrl}/get-all-appointments`);
//     return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/get-all-appointments`, { headers: this.getHeaders() })
//       .pipe(
//         map(response => response.data),
//         catchError(this.handleError)
//       );
//   }

//   getAppointment(id: string): Observable<Appointment> {
//     console.log('Fetching appointment from:', `${this.apiUrl}/get-appointment/${id}`);
//     return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/get-appointment/${id}`, { headers: this.getHeaders() })
//       .pipe(
//         map(response => response.data),
//         catchError(this.handleError)
//       );
//   }

//   createAppointment(dto: AppointmentCreateDto): Observable<Appointment> {
//     console.log('Creating appointment at:', `${this.apiUrl}/create-appointment`, 'with data:', dto);
//     return this.http.post<ApiResponse<Appointment>>(`${this.apiUrl}/create-appointment`, dto, { headers: this.getHeaders() })
//       .pipe(
//         map(response => response.data),
//         catchError(this.handleError)
//       );
//   }

//   updateAppointment(id: string, dto: AppointmentCreateDto): Observable<Appointment> {
//     console.log('Updating appointment at:', `${this.apiUrl}/update-appointment/${id}`, 'with data:', dto);
//     return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/update-appointment/${id}`, dto, { headers: this.getHeaders() })
//       .pipe(
//         map(response => response.data),
//         catchError(this.handleError)
//       );
//   }

//   deleteAppointment(id: string): Observable<void> {
//     console.log('Deleting appointment at:', `${this.apiUrl}/delete-appointment/${id}`);
//     return this.http.delete<{ msg: string }>(`${this.apiUrl}/delete-appointment/${id}`, { headers: this.getHeaders() })
//       .pipe(
//         map(() => undefined),
//         catchError(this.handleError)
//       );
//   }
// }


// src/app/services/admin-appointments.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Appointment {
  appointmentIdPublic: string;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentDateTime: string;
  status: string; 
  notes?: string;
}

export interface AppointmentCreateDto {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  status: string;
  notes?: string;
}

interface ApiResponse<T> {
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAppointmentsService {
  private apiUrl = 'http://localhost:5098/api/AdminAppointments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxMCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwiZXhwIjoxNzQ0MjcyNTYyLCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.iPCeIViK7Ox490pagkwTI-S7P7me8iDNxLyRmE_XFqg';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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

  getAppointments(): Observable<Appointment[]> {
    console.log('Fetching appointments from:', `${this.apiUrl}/get-all-appointments`);
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/get-all-appointments`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getAppointment(id: string): Observable<Appointment> {
    console.log('Fetching appointment from:', `${this.apiUrl}/get-appointment/${id}`);
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/get-appointment/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createAppointment(dto: AppointmentCreateDto): Observable<Appointment> {
    console.log('Creating appointment at:', 'http://localhost:5098/api/Appointments', 'with data:', dto);
    return this.http.post<Appointment>('http://localhost:5098/api/Appointments', dto, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAppointment(id: string, dto: AppointmentCreateDto): Observable<Appointment> {
    console.log('Updating appointment at:', `${this.apiUrl}/update-appointment/${id}`, 'with data:', dto);
    return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/update-appointment/${id}`, dto, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteAppointment(id: string): Observable<void> {
    console.log('Deleting appointment at:', `${this.apiUrl}/delete-appointment/${id}`);
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/delete-appointment/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(() => undefined),
        catchError(this.handleError)
      );
  }
}


