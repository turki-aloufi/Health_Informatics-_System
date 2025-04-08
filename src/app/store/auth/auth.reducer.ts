import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions, loadAuthStateSuccess, loadAuthStateFailure } from './auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  loading: false
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    // Login flow
    on(AuthActions.loginRequest, state => ({ 
      ...state, 
      loading: true, 
      error: null 
    })),
    on(AuthActions.loginSuccess, (state, { response }) => ({
      ...state,
      isAuthenticated: true,
      user: response,
      token: response.token,
      loading: false,
      error: null
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error
    })),
    // Registration flow
    on(AuthActions.registerRequest, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(AuthActions.registerSuccess, (state) => ({
      ...state,
      loading: false,
      error: null
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    // Load auth state
    on(loadAuthStateSuccess, (state, { response }) => ({
      ...state,
      isAuthenticated: true,
      user: {
        userId: response.userId,
        role: response.role
      },
      token: response.token,
      error: null
    })),
    on(loadAuthStateFailure, (state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      token: null,
      error: null
    })),
    // Logout
    on(AuthActions.logout, (state) => ({
      ...state,
      isAuthenticated: false,
      user: null,
      token: null,
      error: null
    }))
  )
});
