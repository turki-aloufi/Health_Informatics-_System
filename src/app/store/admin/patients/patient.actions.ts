// src/app/store/admin/patients/patient.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../../../models/user.model';

export const loadPatients = createAction('[Patient] Load Patients');
export const loadPatientsSuccess = createAction(
  '[Patient] Load Patients Success',
  props<{ patients: User[] }>()
);
export const loadPatientsFailure = createAction(
  '[Patient] Load Patients Failure',
  props<{ error: string }>()
);

export const getPatient = createAction('[Patient] Get Patient', props<{ id: string }>());
export const getPatientSuccess = createAction(
  '[Patient] Get Patient Success',
  props<{ patient: User }>()
);
export const getPatientFailure = createAction(
  '[Patient] Get Patient Failure',
  props<{ error: string }>()
);

export const createPatient = createAction(
  '[Patient] Create Patient',
  props<{ patientData: any }>()
);
export const createPatientSuccess = createAction(
  '[Patient] Create Patient Success',
  props<{ patient: User }>()
);
export const createPatientFailure = createAction(
  '[Patient] Create Patient Failure',
  props<{ error: string }>()
);

export const updatePatient = createAction(
  '[Patient] Update Patient',
  props<{ id: string; patientData: any }>()
);
export const updatePatientSuccess = createAction(
  '[Patient] Update Patient Success',
  props<{ patient: User }>()
);
export const updatePatientFailure = createAction(
  '[Patient] Update Patient Failure',
  props<{ error: string }>()
);

export const deletePatient = createAction(
  '[Patient] Delete Patient',
  props<{ id: string }>()
);
export const deletePatientSuccess = createAction(
  '[Patient] Delete Patient Success',
  props<{ id: string }>()
);
export const deletePatientFailure = createAction(
  '[Patient] Delete Patient Failure',
  props<{ error: string }>()
);