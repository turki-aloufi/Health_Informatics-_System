// src/app/store/admin/patients/patient.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { PatientService } from '../../../services/patient.service';
import * as PatientActions from './patient.actions';

@Injectable()
export class PatientEffects {
  loadPatients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.loadPatients),
      mergeMap(() =>
        this.patientService.getPatients().pipe(
          map((patients) => PatientActions.loadPatientsSuccess({ patients })),
          catchError((error) => of(PatientActions.loadPatientsFailure({ error: error.message })))
        )
      )
    )
  );

  getPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.getPatient),
      mergeMap(({ id }) =>
        this.patientService.getPatients().pipe(
          map((patients) => {
            const patient = patients.find((p) => p.idPublic === id);
            if (!patient) throw new Error('Patient not found');
            return PatientActions.getPatientSuccess({ patient });
          }),
          catchError((error) => of(PatientActions.getPatientFailure({ error: error.message })))
        )
      )
    )
  );

  createPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.createPatient),
      mergeMap(({ patientData }) =>
        this.patientService.createPatient(patientData).pipe(
          map((patient) => PatientActions.createPatientSuccess({ patient })),
          catchError((error) => of(PatientActions.createPatientFailure({ error: error.message })))
        )
      )
    )
  );

  updatePatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.updatePatient),
      mergeMap(({ id, patientData }) =>
        this.patientService.updatePatient(id, patientData).pipe(
          map((patient) => PatientActions.updatePatientSuccess({ patient })),
          catchError((error) => of(PatientActions.updatePatientFailure({ error: error.message })))
        )
      )
    )
  );

  deletePatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.deletePatient),
      mergeMap(({ id }) =>
        this.patientService.deletePatient(id).pipe(
          map(() => PatientActions.deletePatientSuccess({ id })),
          catchError((error) => of(PatientActions.deletePatientFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private patientService: PatientService
  ) {}
}