import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AdminActions from './admin.actions';

export interface AdminState {
  doctors: User[];
}

const initialState: AdminState = {
  doctors: [],
};

export const adminReducer = createReducer(
  initialState,
  on(AdminActions.loadDoctorsSuccess, (state, { doctors }) => ({ ...state, doctors })),
  on(AdminActions.createDoctor, (state, { doctor }) => ({ ...state, doctors: [...state.doctors, doctor] })),
  on(AdminActions.updateDoctor, (state, { doctor }) => ({
    ...state,
    doctors: state.doctors.map((d) => (d.id === doctor.id ? doctor : d)),
  })),
  on(AdminActions.deleteDoctor, (state, { id }) => ({
    ...state,
    doctors: state.doctors.filter((d) => d.id !== id),
  }))
);