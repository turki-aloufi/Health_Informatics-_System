// src/app/auth/store/auth.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginCredentials, RegisterData, LoginResponse } from '../../models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Request': props<{ credentials: LoginCredentials }>(),
    'Login Success': props<{ response: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),

    'Register Request': props<{ registerData: RegisterData }>(),
    'Register Success': props<{ message: string, userId: number }>(),
    'Register Failure': props<{ error: string }>(),

    'Logout': emptyProps()
  }
});