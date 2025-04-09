import { createActionGroup, emptyProps, props, createAction } from '@ngrx/store';
import { LoginCredentials, RegisterData, LoginResponse } from '../../models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Request': props<{ credentials: LoginCredentials }>(),
    'Login Success': props<{ response: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),

    'Register Request': props<{ registerData: RegisterData }>(),
    'Register Success': props<{ message: string; userId: number }>(),
    'Register Failure': props<{ error: string }>(),

    'Logout': emptyProps()
  }
});

// Additional actions for loading auth state during app initialization
export const loadAuthStateSuccess = createAction(
  '[Auth] Load Auth State Success',
  props<{ response: { token: string; userId: string; role: string } }>()
);
export const loadAuthStateFailure = createAction('[Auth] Load Auth State Failure');
