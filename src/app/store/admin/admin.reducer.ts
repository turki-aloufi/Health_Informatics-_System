// // src/app/store/admin/admin.reducer.ts
// import { createReducer, on } from '@ngrx/store';
// import { User } from '../../models/user.model';
// import * as AdminActions from './admin.actions';

// export interface AdminState {
//   doctors: User[];
//   error: string | null; // Added for error handling
// }

// const initialState: AdminState = {
//   doctors: [],
//   error: null,
// };

// export const adminReducer = createReducer(
//   initialState,
//   on(AdminActions.loadDoctors, (state) => ({ ...state, error: null })),
//   on(AdminActions.loadDoctorsSuccess, (state, { doctors }) => ({
//     ...state,
//     doctors,
//     error: null,
//   })),
//   on(AdminActions.loadDoctorsFailure, (state, { error }) => ({
//     ...state,
//     error,
//   })),
//   on(AdminActions.createDoctor, (state, { doctor }) => ({
//     ...state,
//     doctors: [...state.doctors, doctor],
//   })),
//   on(AdminActions.updateDoctor, (state, { doctor }) => ({
//     ...state,
//     doctors: state.doctors.map((d) => (d.id === doctor.id ? doctor : d)),
//   })),
//   on(AdminActions.deleteDoctor, (state, { id }) => ({
//     ...state,
//     doctors: state.doctors.filter((d) => d.id !== id),
//   }))
// );

// export const adminFeatureKey = 'admin'; // Added feature key