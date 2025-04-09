// src/app/store/admin/admin.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const loadDoctors = createAction('[Admin] Load Doctors');
export const loadDoctorsSuccess = createAction(
  '[Admin] Load Doctors Success',
  props<{ doctors: User[] }>()
);
export const loadDoctorsFailure = createAction(
  '[Admin] Load Doctors Failure',
  props<{ error: string }>()
);
export const createDoctor = createAction(
  '[Admin] Create Doctor',
  props<{ doctor: User }>()
);
export const updateDoctor = createAction(
  '[Admin] Update Doctor',
  props<{ doctor: User }>()
);
export const deleteDoctor = createAction(
  '[Admin] Delete Doctor',
  props<{ id: string }>()
);