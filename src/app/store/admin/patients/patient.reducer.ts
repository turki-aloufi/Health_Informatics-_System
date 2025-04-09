// src/app/store/admin/patients/patient.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { User } from '../../../models/user.model';
import * as PatientActions from './patient.actions';

export interface PatientState {
  patients: User[];
  loading: boolean;
  error: string | null;
  success: boolean; // Added to track successful operations
}

export const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  success: false,
};

export const patientReducer = createReducer(
  initialState,

  on(PatientActions.loadPatients, (state) => ({ ...state, loading: true, error: null, success: false })),
  on(PatientActions.loadPatientsSuccess, (state, { patients }) => ({
    ...state,
    patients,
    loading: false,
    error: null,
    success: true,
  })),
  on(PatientActions.loadPatientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false,
  })),

  on(PatientActions.getPatient, (state) => ({ ...state, loading: true, error: null, success: false })),
  on(PatientActions.getPatientSuccess, (state, { patient }) => ({
    ...state,
    patients: state.patients.some((p) => p.idPublic === patient.idPublic)
      ? state.patients.map((p) => (p.idPublic === patient.idPublic ? patient : p))
      : [...state.patients, patient],
    loading: false,
    error: null,
    success: true,
  })),
  on(PatientActions.getPatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false,
  })),

  on(PatientActions.createPatient, (state) => ({ ...state, loading: true, error: null, success: false })),
  on(PatientActions.createPatientSuccess, (state, { patient }) => ({
    ...state,
    patients: [...state.patients, patient],
    loading: false,
    error: null,
    success: true,
  })),
  on(PatientActions.createPatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false,
  })),

  on(PatientActions.updatePatient, (state) => ({ ...state, loading: true, error: null, success: false })),
  on(PatientActions.updatePatientSuccess, (state, { patient }) => ({
    ...state,
    patients: state.patients.map((p) => (p.idPublic === patient.idPublic ? patient : p)),
    loading: false,
    error: null,
    success: true,
  })),
  on(PatientActions.updatePatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false,
  })),

  on(PatientActions.deletePatient, (state) => ({ ...state, loading: true, error: null, success: false })),
  on(PatientActions.deletePatientSuccess, (state, { id }) => ({
    ...state,
    patients: state.patients.filter((p) => p.idPublic !== id),
    loading: false,
    error: null,
    success: true,
  })),
  on(PatientActions.deletePatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false,
  }))
);

export const patientFeatureKey = 'patient';