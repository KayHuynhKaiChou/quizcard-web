import { createAction, props } from '@ngrx/store';
import { User } from '../../types';

// Login Actions
export const loginRequest = createAction(
  '[Auth] Login Request',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// User Profile Actions
export const loadUserProfile = createAction('[Auth] Load User Profile');

export const loadUserProfileSuccess = createAction(
  '[Auth] Load User Profile Success',
  props<{ user: User }>()
);

export const loadUserProfileFailure = createAction(
  '[Auth] Load User Profile Failure',
  props<{ error: string }>()
);

// Clear Error Action
export const clearError = createAction('[Auth] Clear Error');

// Set Loading Action
export const setLoading = createAction(
  '[Auth] Set Loading',
  props<{ isLoading: boolean }>()
);

// Initialize Auth (for app startup)
export const initializeAuth = createAction('[Auth] Initialize Auth');
