// src/app/components/admin/patient-management/patient-management.component.ts
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { Router, RouterModule } from '@angular/router'
import { CardModule } from 'primeng/card'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api'
import { HttpClientModule } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { User } from '../../../models/user.model'
import * as PatientActions from '../../../store/admin/patients/patient.actions'
import { PatientState } from '../../../store/admin/patients/patient.reducer'

@Component({
  standalone: true,
  selector: 'app-patient-management',
  template: `
    <div class="h-screen">
      <p-card  styleClass="mb-4">
        <div class="mb-4 flex justify-between ">
          <h2 class="text-xl font-semibold">Patients List</h2>
          <p-button
            label="Add Patient"
            icon="pi pi-plus"
            (onClick)="navigateToForm()"
            styleClass="p-button-rounded"
          >
          </p-button>
        </div>

        <ng-container *ngIf="patients$ | async as patients">
          <p-table
            [value]="patients"
            [tableStyle]="{ 'min-width': '50rem' }"
            [paginator]="true"
            [rows]="10"
            [showCurrentPageReport]="true"
            responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} patients"
            [rowsPerPageOptions]="[5, 10, 25]"
            [loading]="loading$ | async"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Medical History</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-patient let-i="rowIndex">
              <tr>
                <td>{{ i + 1 }}</td>
                <td>{{ patient.name }}</td>
                <td>{{ patient.email }}</td>
                <td>{{ patient.phoneNumber }}</td>
                <td>
                  {{ patient.patientProfile?.medicalHistory || 'Not set' }}
                </td>
                <td>
                  <div class="flex gap-2">
                    <p-button
                      label="Edit"
                      icon="pi pi-pencil"
                      (onClick)="navigateToForm(patient.idPublic)"
                      styleClass="p-button-sm p-button-info"
                    >
                    </p-button>
                    <p-button
                      label="Delete"
                      icon="pi pi-trash"
                      (onClick)="confirmDelete(patient)"
                      styleClass="p-button-sm p-button-danger"
                    >
                    </p-button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center p-4">
                  No patients found. Click "Add Patient" to create one.
                </td>
              </tr>
            </ng-template>
          </p-table>
        </ng-container>
      </p-card>
    </div>
    <p-toast></p-toast>
    <p-confirmDialog
      header="Confirmation"
      icon="pi pi-exclamation-triangle"
    ></p-confirmDialog>
  `,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    HttpClientModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class PatientManagementComponent implements OnInit {
  patients$: Observable<User[]>
  loading$: Observable<boolean>
  error$: Observable<string | null>

  constructor(
    private store: Store<{ patient: PatientState }>,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.patients$ = this.store.select(state => state.patient.patients)
    this.loading$ = this.store.select(state => state.patient.loading)
    this.error$ = this.store.select(state => state.patient.error)
  }

  ngOnInit() {
    console.log('Dispatching loadPatients')
    this.store.dispatch(PatientActions.loadPatients())
    this.error$.subscribe(error => {
      if (error) {
        console.error('Patient fetch error:', error)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to manage patients: ${error}`,
        })
      }
    })
  }

  navigateToForm(patientId?: string) {
    console.log('Navigating to form, patientId:', patientId)
    if (patientId) {
      this.router
        .navigate(['/admin/patient-form', { id: patientId }])
        .then(success => console.log('Edit navigation success:', success))
        .catch(err => console.error('Edit navigation error:', err))
    } else {
      this.router
        .navigate(['/admin/patient-form'])
        .then(success => console.log('Add navigation success:', success))
        .catch(err => console.error('Add navigation error:', err))
    }
  }

  confirmDelete(patient: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${patient.name}?`,
      accept: () => {
        this.deletePatient(patient)
      },
    })
  }

  deletePatient(patient: User) {
    if (!patient.idPublic) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Patient ID is missing',
      })
      return
    }
    this.store.dispatch(PatientActions.deletePatient({ id: patient.idPublic }))
    this.patients$.subscribe(patients => {
      if (patients && !patients.some(p => p.idPublic === patient.idPublic)) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${patient.name} has been deleted`,
        })
      }
    })
  }
}
