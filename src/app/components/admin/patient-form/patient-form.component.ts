// src/app/components/admin/patient-form/patient-form.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, Gender, UserRole } from '../../../models/user.model';
import { PatientProfile } from '../../../models/patient-profile.model';
import * as PatientActions from '../../../store/admin/patients/patient.actions';
import { PatientState } from '../../../store/admin/patients/patient.reducer';

interface FormUser extends Omit<User, 'patientProfile'> {
  patientProfile: PatientProfile;
}

@Component({
  standalone: true,
  selector: 'app-patient-form',
  template: `
    <div class="p-4">
      <h2>{{ id ? 'Edit Patient' : 'Add Patient' }}</h2>
      <form #patientForm="ngForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label>Name</label>
          <input pInputText [(ngModel)]="patient.name" name="name" required />
        </div>
        <div class="mb-3">
          <label>Email</label>
          <input pInputText [(ngModel)]="patient.email" name="email" type="email" required />
        </div>
        <div class="mb-3" *ngIf="!id">
          <label>Password</label>
          <input pInputText [(ngModel)]="patient.password" name="password" type="password" required />
        </div>
        <div class="mb-3">
          <label>Date of Birth</label>
          <input pInputText [(ngModel)]="doBString" name="doB" type="date" required />
        </div>
        <div class="mb-3">
          <label>SSN</label>
          <input pInputText [(ngModel)]="patient.ssn" name="ssn" required />
        </div>
        <div class="mb-3">
          <label>Gender</label>
          <p-dropdown 
            [(ngModel)]="patient.gender" 
            name="gender" 
            [options]="genderOptions" 
            optionLabel="label" 
            optionValue="value" 
            required>
          </p-dropdown>
        </div>
        <div class="mb-3">
          <label>Phone Number</label>
          <input pInputText [(ngModel)]="patient.phoneNumber" name="phoneNumber" required />
        </div>
        <div class="mb-3">
          <label>Address</label>
          <input pInputText [(ngModel)]="patient.address" name="address" required />
        </div>
        <div class="mb-3" *ngIf="id">
          <label>Medical History</label>
          <input pInputText [(ngModel)]="patient.patientProfile.medicalHistory" name="medicalHistory" />
        </div>
        <div class="mb-3" *ngIf="id">
          <label>Insurance Details</label>
          <input pInputText [(ngModel)]="patient.patientProfile.insuranceDetails" name="insuranceDetails" />
        </div>
        <div class="mb-3" *ngIf="id">
          <label>Emergency Contact</label>
          <input pInputText [(ngModel)]="patient.patientProfile.emergencyContact" name="emergencyContact" />
        </div>
        <p-button 
          type="submit" 
          label="Save" 
          [disabled]="!patientForm.valid || (loading$ | async)" 
          [loading]="loading$ | async">
        </p-button>
        <p-button label="Cancel" (onClick)="cancel()" styleClass="p-button-secondary ml-2"></p-button>
      </form>
    </div>
    <p-toast></p-toast>
  `,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class PatientFormComponent implements OnInit {
  @ViewChild('patientForm') patientForm!: NgForm;

  id: string | null = null;
  patient: FormUser = {
    idPublic: '',
    name: '',
    email: '',
    password: '',
    role: UserRole.Patient,
    doB: new Date(),
    ssn: '',
    gender: Gender.Male,
    phoneNumber: '',
    address: '',
    patientProfile: {
      userId: '',
      medicalHistory: '',
      insuranceDetails: '',
      emergencyContact: '',
    },
  };
  doBString: string = '';
  patients$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female },
  ];

  constructor(
    private store: Store<{ patient: PatientState }>,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.patients$ = this.store.select((state) => state.patient.patients);
    this.loading$ = this.store.select((state) => state.patient.loading);
    this.error$ = this.store.select((state) => state.patient.error);
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.doBString = this.formatDate(this.patient.doB);

    if (this.id) {
      this.store.dispatch(PatientActions.getPatient({ id: this.id }));
      this.patients$.subscribe((patients) => {
        const patient = patients.find((p) => p.idPublic === this.id);
        if (patient) {
          this.patient = {
            ...patient,
            doB: typeof patient.doB === 'string' ? new Date(patient.doB) : patient.doB,
            patientProfile: patient.patientProfile || {
              userId: this.id || '',
              medicalHistory: '',
              insuranceDetails: '',
              emergencyContact: '',
            },
          } as FormUser;
          this.doBString = this.formatDate(this.patient.doB);
        }
      });
    }

    this.error$.subscribe((error) => {
      if (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.id ? 'update' : 'create'} patient: ${error}`,
        });
      }
    });
  }

  onSubmit() {
    if (!this.doBString) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Date of Birth is required',
      });
      return;
    }

    this.patient.doB = new Date(this.doBString);
    const patientData = this.id
      ? {
          name: this.patient.name,
          email: this.patient.email,
          doB: this.patient.doB.toISOString(),
          ssn: this.patient.ssn,
          gender: this.patient.gender === Gender.Male ? 0 : 1,
          phoneNumber: this.patient.phoneNumber,
          address: this.patient.address,
          medicalHistory: this.patient.patientProfile.medicalHistory,
          insuranceDetails: this.patient.patientProfile.insuranceDetails,
          emergencyContact: this.patient.patientProfile.emergencyContact,
        }
      : {
          name: this.patient.name,
          email: this.patient.email,
          password: this.patient.password || undefined,
          doB: this.patient.doB.toISOString(),
          ssn: this.patient.ssn,
          gender: this.patient.gender === Gender.Male ? 0 : 1,
          phoneNumber: this.patient.phoneNumber,
          address: this.patient.address,
        };

    console.log('Submitting patient data:', patientData);

    if (this.id) {
      this.store.dispatch(PatientActions.updatePatient({ id: this.id, patientData }));
    } else {
      this.store.dispatch(PatientActions.createPatient({ patientData }));
    }

    this.store.subscribe((state) => {
      const patientState = state.patient as PatientState;
      if (patientState.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.id ? 'Patient updated' : 'Patient created',
        });
        this.router.navigate(['/admin/patients']);
      }
    });
  }

  cancel() {
    if (this.patientForm?.dirty) {
      if (confirm('Are you sure you want to discard changes?')) {
        this.router.navigate(['/admin/patients']);
      }
    } else {
      this.router.navigate(['/admin/patients']);
    }
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }
}