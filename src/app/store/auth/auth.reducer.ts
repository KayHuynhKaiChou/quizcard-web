import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState, // localStorageSync sẽ tự động hydrate từ localStorage
  
  // Login Actions
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error
  })),
  
  // Logout Actions
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })),
  
  // User Profile Actions
  on(AuthActions.loadUserProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Utility Actions
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  })),
  
  on(AuthActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  }))
);
