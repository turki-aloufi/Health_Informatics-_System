import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:5098/api/Dashboard';

  constructor(private http: HttpClient) {}

  private getAuthToken(): string {
    // Changed from 'auth_token' to 'authToken' to match what's set in AuthEffects
    return localStorage.getItem('authToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxMCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwiZXhwIjoxNzQ0MTk1NTUxLCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.qnjpS5P_ucGXYFIG7nyY4sYUiEKkJjgvxvYO18BHJMo';
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Fixed template literal syntax by adding backticks
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error Response:', error);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error) {
      console.log('Error details:', error.error);
      
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (typeof error.error === 'object') {
        if (error.error.msg) {
          errorMessage = error.error.msg;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.errors) {
          try {
            errorMessage = JSON.stringify(error.error.errors);
          } catch (e) {
            console.error('Error extracting validation errors:', e);
          }
        }
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getDashboardSummary(): Observable<any> {
    console.log('Fetching dashboard summary...');
    return this.http
      .get<any>(`${this.apiUrl}/summary`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Dashboard summary response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getAppointmentsTrend(days: number = 30): Observable<any> {
    console.log(`Fetching appointments trend for ${days} days...`);
    return this.http
      .get<any>(`${this.apiUrl}/appointments-trend?days=${days}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Appointments trend response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getDoctorsWorkload(): Observable<any> {
    console.log('Fetching doctors workload...');
    return this.http
      .get<any>(`${this.apiUrl}/doctors-workload`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Doctors workload response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getPatientsDemographics(): Observable<any> {
    console.log('Fetching patients demographics...');
    return this.http
      .get<any>(`${this.apiUrl}/patients-demographics`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Patients demographics response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  } 
}