import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.loginRequest, state => ({ 
      ...state, 
      loading: true, 
      error: null 
    })),
    on(AuthActions.loginSuccess, (state, { response }) => ({
      ...state,
      isAuthenticated: true,
      user: response,
      loading: false,
      error: null
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      loading: false,
      error
    })),
    on(AuthActions.registerRequest, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(AuthActions.registerSuccess, (state, { userId }) => ({
      ...state,
      loading: false,
      error: null
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    }))
  )
});