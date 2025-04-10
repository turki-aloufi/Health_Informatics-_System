import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    private baseUrl = 'http://localhost:5098/api/Doctors';
  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.baseUrl);
  }
}
