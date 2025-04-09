import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '@/app/services/doctor.service';
import { DoctorProfile } from '../../models/doctor-profile.model';
import { CardModule } from 'primeng/card';
import { LoadingComponent } from '../shared/loading';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, CardModule, LoadingComponent],
  templateUrl: './doctor-profile.component.html'
//   styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctorProfile: any;
  loading = true;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.doctorService.getMyProfile()
      .subscribe({
        next: (profile) => {
          this.doctorProfile = profile;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load profile: ' + (err.message || 'Unknown error');
          this.loading = false;
        }
      });
  }
}