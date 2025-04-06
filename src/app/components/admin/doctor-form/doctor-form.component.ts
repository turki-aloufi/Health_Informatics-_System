import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DoctorService } from '../../../services/admin-doctor.service';
import { User, UserRole, Gender } from '../../../models/user.model';
import { DoctorProfile } from '../../../models/doctor-profile.model';
import { DoctorAvailability } from '../../../models/doctor-availability.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-doctor-form',
  template: `
    <h1>Doctor Information</h1>
    <form #doctorForm="ngForm" (ngSubmit)="saveDoctor()">
      <div>
        <label>Name</label>
        <input pInputText [(ngModel)]="doctor.name" name="name" required />
      </div>
      <div>
        <label>Email</label>
        <input pInputText [(ngModel)]="doctor.email" name="email" type="email" required />
      </div>
      <div>
        <label>SSN</label>
        <input pInputText [(ngModel)]="doctor.ssn" name="ssn" required />
      </div>
      <div>
        <label>Specialty</label>
        <input pInputText [(ngModel)]="doctorProfile.specialty" name="specialty" required />
      </div>
      <div>
        <label>Clinic</label>
        <input pInputText [(ngModel)]="doctorProfile.clinic" name="clinic" />
      </div>
      <div>
        <label>Availability</label>
        <div *ngFor="let day of daysOfWeek; let i = index">
          <label>{{day}}</label>
          <p-dropdown [options]="hours" [(ngModel)]="availabilities[i].startTime" [name]="'start' + i"></p-dropdown>
          <p-dropdown [options]="hours" [(ngModel)]="availabilities[i].endTime" [name]="'end' + i"></p-dropdown>
        </div>
      </div>
      <p-button label="Save" type="submit" [disabled]="!doctorForm.valid"></p-button>
      <p-button label="Cancel" (onClick)="cancel()" styleClass="p-button-danger"></p-button>
    </form>
  `,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, DropdownModule, ReactiveFormsModule, RouterModule],

})
export class DoctorFormComponent implements OnInit {
  doctor: User = { role: UserRole.Doctor } as User;
  doctorProfile: DoctorProfile = {} as DoctorProfile;
  availabilities: DoctorAvailability[] = Array(7).fill(null).map((_, i) => ({ dayOfWeek: i + 1, startTime: '', endTime: '' }));
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  hours = ['08:00 AM', '04:00 PM', '--:-- AM', '--:-- PM'];

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.doctorService.getDoctor(doctorId).subscribe((doctor) => {
        this.doctor = doctor;
        this.doctorProfile = doctor.doctorProfile || ({} as DoctorProfile);
        this.availabilities = this.doctorProfile.availabilities || this.availabilities;
      });
    }
  }

  saveDoctor() {
    this.doctor.doctorProfile = { ...this.doctorProfile, availabilities: this.availabilities };
    const action = this.doctor.id
      ? this.doctorService.updateDoctor(this.doctor)
      : this.doctorService.createDoctor(this.doctor);
    action.subscribe(() => this.router.navigate(['/admin/doctor-management']));
  }

  cancel() {
    this.router.navigate(['/admin/doctor-management']);
  }
}