import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User, Gender, UserRole } from '../models/user.model';

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

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxMDAzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbjJAYWRtaW4uY29tIiwiZXhwIjoxNzQ0MDE0OTIzLCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.dcZI7WGwjI4hKxnzf-mYq_HBJ3qdm1NIr0jqmU7GyeY`
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

  getDoctors(): Observable<User[]> {
    console.log('Fetching all doctors...');
    return this.http
      .get<ApiResponse<User[]>>(`${this.apiUrl}/get-all-doctors`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Doctors response:', response);
          // No mapping needed since models are aligned
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getDoctor(id: string): Observable<User> {
    if (!id) {
      return throwError(() => new Error('Doctor ID is required'));
    }
    
    console.log(`Fetching doctor with ID: ${id}`);
    return this.http
      .get<ApiResponse<User>>(`${this.apiUrl}/get-doctor-by-id/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Doctor details response:', response);
          // No mapping needed since models are aligned
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  createDoctor(doctorData: any): Observable<User> {
    // Make sure gender is the numeric value (if it's string)
    const formattedData = {
      ...doctorData,
      // Ensure gender is numeric
      gender: typeof doctorData.gender === 'string' 
        ? (doctorData.gender === 'Male' ? Gender.Male : Gender.Female)
        : doctorData.gender,
      // Ensure role is numeric
      role: UserRole.Doctor
    };
    
    console.log('Creating doctor with formatted data:', formattedData);
    
    return this.http
      .post<ApiResponse<User>>(`${this.apiUrl}/create-doctor`, formattedData, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          console.log('Create doctor response:', response);
          // No mapping needed since models are aligned
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  updateDoctor(doctorData: any): Observable<User> {
    if (!doctorData.idPublic) {
      return throwError(() => new Error('Doctor ID is required for updates'));
    }
    
    // Make sure gender is the numeric value (if it's string)
    const formattedData = {
      ...doctorData,
      // Ensure gender is numeric
      gender: typeof doctorData.gender === 'string' 
        ? (doctorData.gender === 'Male' ? Gender.Male : Gender.Female)
        : doctorData.gender
    };
    
    console.log(`Updating doctor with ID: ${doctorData.idPublic}`, formattedData);
    
    return this.http
      .put<ApiResponse<User>>(
        `${this.apiUrl}/update-doctor/${doctorData.idPublic}`,
        formattedData,
        { headers: this.getHeaders() }
      )
      .pipe(
        map((response) => {
          console.log('Update doctor response:', response);
          // No mapping needed since models are aligned
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  deleteDoctor(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Doctor ID is required for deletion'));
    }
    
    console.log(`Deleting doctor with ID: ${id}`);
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/delete-doctor/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map(() => {
          console.log('Doctor deleted successfully');
          return undefined;
        }),
        catchError(this.handleError)
      );
  }
}