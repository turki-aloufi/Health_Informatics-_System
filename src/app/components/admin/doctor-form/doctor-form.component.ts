import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { DoctorService } from '../../../services/admin-doctor.service';
import { Gender, UserRole } from '../../../models/user.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-doctor-form',
  template: `
    <p-card [header]="isEditMode ? 'Edit Doctor' : 'Add Doctor'" styleClass="mb-4">
      <form #doctorForm="ngForm" (ngSubmit)="saveDoctor()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Basic Information -->
        <div class="col-span-2">
          <p-divider align="left">
            <span class="p-tag">Basic Information</span>
          </p-divider>
        </div>
        
        <div class="field">
          <label for="name" class="block mb-1">Name *</label>
          <input id="name" pInputText [(ngModel)]="doctor.name" name="name" required class="w-full" />
        </div>
        
        <div class="field">
          <label for="email" class="block mb-1">Email *</label>
          <input id="email" pInputText [(ngModel)]="doctor.email" name="email" type="email" required class="w-full" />
        </div>
        
        <div class="field" *ngIf="!isEditMode">
          <label for="password" class="block mb-1">Password *</label>
          <p-password id="password" [(ngModel)]="doctor.password" name="password" [toggleMask]="true" 
            [feedback]="false" required class="w-full"></p-password>
        </div>
        
        <div class="field">
          <label for="doB" class="block mb-1">Date of Birth *</label>
          <p-calendar id="doB" [(ngModel)]="doctor.doB" name="doB" dateFormat="dd/mm/yy" 
            [showIcon]="true" required class="w-full"></p-calendar>
        </div>
        
        <div class="field">
          <label for="ssn" class="block mb-1">SSN *</label>
          <input id="ssn" pInputText [(ngModel)]="doctor.ssn" name="ssn" required class="w-full" />
        </div>
        
        <div class="field">
          <label for="gender" class="block mb-1">Gender *</label>
          <p-dropdown id="gender" [options]="genderOptions" [(ngModel)]="doctor.gender" 
            name="gender" optionLabel="label" optionValue="value" required class="w-full"></p-dropdown>
        </div>
        
        <div class="field">
          <label for="phoneNumber" class="block mb-1">Phone Number</label>
          <input id="phoneNumber" pInputText [(ngModel)]="doctor.phoneNumber" name="phoneNumber" class="w-full" />
        </div>
        
        <div class="field">
          <label for="address" class="block mb-1">Address</label>
          <input id="address" pInputText [(ngModel)]="doctor.address" name="address" class="w-full" />
        </div>
        
        <!-- Professional Information -->
        <div class="col-span-2">
          <p-divider align="left">
            <span class="p-tag">Professional Information</span>
          </p-divider>
        </div>
        
        <div class="field">
          <label for="specialty" class="block mb-1">Specialty *</label>
          <input id="specialty" pInputText [(ngModel)]="doctorProfile.specialty" name="specialty" required class="w-full" />
        </div>
        
        <div class="field">
          <label for="licenseNumber" class="block mb-1">License Number *</label>
          <input id="licenseNumber" pInputText [(ngModel)]="doctorProfile.licenseNumber" name="licenseNumber" required class="w-full" />
        </div>
        
        <div class="field">
          <label for="clinic" class="block mb-1">Clinic</label>
          <input id="clinic" pInputText [(ngModel)]="doctorProfile.clinic" name="clinic" class="w-full" />
        </div>
        
        <!-- Availability Schedule -->
        <div class="col-span-2">
          <p-divider align="left">
            <span class="p-tag">Availability Schedule</span>
          </p-divider>
        </div>
        
        <div class="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="field" *ngFor="let day of daysOfWeek; let i = index">
            <label class="block font-medium mb-2">{{ day }}</label>
            <div class="flex gap-2">
              <p-dropdown [options]="timeOptions" [(ngModel)]="availabilities[i].startTime" 
                [name]="'start' + i" placeholder="Start Time" class="w-full"></p-dropdown>
              <p-dropdown [options]="timeOptions" [(ngModel)]="availabilities[i].endTime" 
                [name]="'end' + i" placeholder="End Time" class="w-full"></p-dropdown>
            </div>
          </div>
        </div>
        
        <!-- Form Actions -->
        <div class="col-span-2 mt-4 flex gap-2 justify-end">
          <p-button label="Cancel" (onClick)="cancel()" styleClass="p-button-secondary"></p-button>
          <p-button label="Save" type="submit" [disabled]="!doctorForm.valid"></p-button>
        </div>
      </form>
      
      <div *ngIf="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>
    </p-card>
    
    <p-toast></p-toast>
  `,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    InputTextModule, 
    DropdownModule, 
    CalendarModule,
    PasswordModule,
    RouterModule,
    DividerModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class DoctorFormComponent implements OnInit {
  isEditMode = false;
  errorMessage = '';
  
  // Base doctor object with proper property names
  doctor: any = {
    idPublic: undefined,
    name: '',
    email: '',
    password: '',
    doB: new Date(),
    ssn: '',
    gender: Gender.Male,
    phoneNumber: '',
    address: '',
    role: UserRole.Doctor
  };
  
  // Separate doctor profile data
  doctorProfile: any = {
    specialty: '',
    licenseNumber: '',
    clinic: ''
  };
  
  // Availabilities with proper format
  availabilities: any[] = [];
  
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female }
  ];
  
  timeOptions = [
    { label: 'Not Available', value: null },
    { label: '8:00 AM', value: '08:00:00' },
    { label: '9:00 AM', value: '09:00:00' },
    { label: '10:00 AM', value: '10:00:00' },
    { label: '11:00 AM', value: '11:00:00' },
    { label: '12:00 PM', value: '12:00:00' },
    { label: '1:00 PM', value: '13:00:00' },
    { label: '2:00 PM', value: '14:00:00' },
    { label: '3:00 PM', value: '15:00:00' },
    { label: '4:00 PM', value: '16:00:00' },
    { label: '5:00 PM', value: '17:00:00' },
    { label: '6:00 PM', value: '18:00:00' }
  ];

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    // Initialize availabilities for each day of the week
    this.availabilities = Array(7).fill(null).map((_, i) => ({ 
      dayOfWeek: i + 1, // 1 = Monday, 7 = Sunday
      startTime: null, 
      endTime: null 
    }));
  }

  ngOnInit() {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.isEditMode = true;
      this.loadDoctor(doctorId);
    }
  }

  loadDoctor(id: string) {
    this.doctorService.getDoctor(id).subscribe({
      next: (doctor) => {
        console.log('Doctor loaded successfully:', doctor);
        
        // Map the doctor data to our form
        this.doctor = {
          idPublic: doctor.idPublic,
          name: doctor.name,
          email: doctor.email,
          doB: doctor.doB instanceof Date ? doctor.doB : new Date(doctor.doB as string),
          ssn: doctor.ssn,
          gender: doctor.gender,
          phoneNumber: doctor.phoneNumber || '',
          address: doctor.address || '',
          role: doctor.role
        };

        // Map doctor profile separately
        this.doctorProfile = {
          specialty: doctor.doctorProfile?.specialty || '',
          licenseNumber: doctor.doctorProfile?.licenseNumber || '',
          clinic: doctor.doctorProfile?.clinic || ''
        };

        // Reset availabilities
        this.availabilities = Array(7).fill(null).map((_, i) => ({ 
          dayOfWeek: i + 1, 
          startTime: null, 
          endTime: null 
        }));

        // Map availabilities if they exist
        if (doctor.doctorProfile?.availabilities && doctor.doctorProfile.availabilities.length > 0) {
          doctor.doctorProfile.availabilities.forEach((avail: any) => {
            const dayIndex = avail.dayOfWeek - 1;
            if (dayIndex >= 0 && dayIndex < 7) {
              this.availabilities[dayIndex].startTime = avail.startTime;
              this.availabilities[dayIndex].endTime = avail.endTime;
            }
          });
        }

        // Debug info only logged to console now, not displayed in UI
        console.debug('Debug info:', {
          loadedDoctor: doctor,
          mappedDoctorForm: {
            doctor: this.doctor,
            doctorProfile: this.doctorProfile,
            availabilities: this.availabilities
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load doctor information. Please try again.';
        console.error('Error loading doctor:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage
        });
      }
    });
  }

  saveDoctor() {
    this.errorMessage = '';
    
    // Filter out availabilities where both start and end time are null
    const filteredAvailabilities = this.availabilities
      .filter(a => a.startTime && a.endTime)
      .map(a => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime
      }));
    
    // Create the payload that matches the backend model structure
    const doctorData = {
      idPublic: this.doctor.idPublic,
      name: this.doctor.name,
      email: this.doctor.email,
      password: this.isEditMode ? undefined : this.doctor.password,
      doB: this.doctor.doB instanceof Date ? this.doctor.doB.toISOString() : this.doctor.doB,
      ssn: this.doctor.ssn,
      gender: this.doctor.gender,
      phoneNumber: this.doctor.phoneNumber,
      address: this.doctor.address,
      role: UserRole.Doctor,
      specialty: this.doctorProfile.specialty,
      licenseNumber: this.doctorProfile.licenseNumber,
      clinic: this.doctorProfile.clinic,
      availabilities: filteredAvailabilities
    };
    
    // Debug info only logged to console now, not displayed in UI
    console.debug('Sending doctor data:', doctorData);
    
    if (this.isEditMode) {
      this.doctorService.updateDoctor(doctorData).subscribe({
        next: (response) => {
          console.log('Doctor updated successfully:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Doctor updated successfully'
          });
          this.router.navigate(['/admin/doctor-management']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update doctor. Please check your information and try again.';
          console.error('Error details:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.errorMessage
          });
        }
      });
    } else {
      this.doctorService.createDoctor(doctorData).subscribe({
        next: (response) => {
          console.log('Doctor created successfully:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Doctor created successfully'
          });
          this.router.navigate(['/admin/doctor-management']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create doctor. Please check your information and try again.';
          console.error('Error details:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.errorMessage
          });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/doctor-management']);
  }
}