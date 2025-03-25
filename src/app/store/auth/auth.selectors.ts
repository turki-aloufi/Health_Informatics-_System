// src/app/auth/store/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../models/auth.model'; 

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);