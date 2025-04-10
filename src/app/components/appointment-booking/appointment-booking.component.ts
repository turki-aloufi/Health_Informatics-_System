// src/app/features/appointment-booking/appointment-booking.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService, Doctor } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { User } from '@/app/models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '@/app/services/auth.service';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './appointment-booking.component.html',
})
export class AppointmentBookingComponent implements OnInit {
  bookingForm: FormGroup;
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  availableSlots: string[] = []; // Using string array based on the API
  selectedDate: string = '';
  selectedDoctorId: number | null = null;
  userId?: string
  bookingSuccess = false;
  bookingError = '';
  searchTerm = '';
  today = new Date();
  user?: User

  private userSubscription?: Subscription

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService:AuthService
  ) {
    this.bookingForm = this.fb.group({
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user
    
    })

    this.loadDoctors();
    // Get userId from localStorage (assuming it's stored after login)
    if (this.user) {
      this.userId = this.user?.id;
    } else {
      console.warn('User data not found in localStorage');
    }
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.filteredDoctors = data;
      },
      error: (err) => console.error('Error loading doctors:', err)
    });
  }

  filterDoctors(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDoctors = this.doctors;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredDoctors = this.doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(term) || 
      doctor.specialty.toLowerCase().includes(term) || 
      doctor.clinic.toLowerCase().includes(term)
    );
  }

  selectDoctor(doctorId: number): void {
    this.selectedDoctorId = doctorId;
    this.bookingForm.patchValue({ doctorId });
    // Clear previously loaded slots when doctor changes
    this.availableSlots = [];
    this.bookingForm.get('appointmentTime')?.setValue('');
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    
    if (this.selectedDoctorId && this.selectedDate) {
      this.loadAvailableSlots();
    }
  }

  loadAvailableSlots(): void {
    if (!this.selectedDoctorId || !this.selectedDate) return;
    
    this.appointmentService.getAvailableSlots(this.selectedDoctorId, this.selectedDate).subscribe({
      next: (slots: string[]) => {
        console.log('Available slots loaded: ', slots);
        this.availableSlots = slots;
      },
      error: (err) => console.error('Error loading available slots:', err)
    });
  }

  selectTimeSlot(slot: string): void {
    const timeValue = slot.split('T')[1];
    console.log('Time slot clicked: ', timeValue);
    this.bookingForm.patchValue({ appointmentTime: timeValue });
  }

  bookAppointment(): void {
    if (this.bookingForm.invalid || !this.userId) {
      console.warn('Form invalid or user not logged in', this.bookingForm.value);
      return;
    }
    
    const formValues = this.bookingForm.value;
    const appointmentDateTime = `${formValues.appointmentDate}T${formValues.appointmentTime}`;
    
    // Create appointment data with null-safe notes field
    const appointmentData = {
      patientId: this.userId,
      doctorId: formValues.doctorId,
      appointmentDateTime: appointmentDateTime,
      notes: formValues.notes || '' // Convert null to empty string
    };
    
    console.log('Booking appointment with data: ', appointmentData);
    
    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: () => {
        console.log('Appointment booked successfully');
        this.bookingSuccess = true;
        this.bookingError = '';
        this.bookingForm.reset();
        this.selectedDoctorId = null;
        this.selectedDate = '';
        this.availableSlots = [];
      },
      error: (err) => {
        console.error('Error booking appointment: ', err);
        this.bookingError = err.error?.error || 'An error occurred while booking the appointment';
        this.bookingSuccess = false;
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filterDoctors();
  }
}