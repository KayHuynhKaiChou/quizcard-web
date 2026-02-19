import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, accessToken, refreshToken }) => ({
    ...state,
    user,
    token: accessToken,
    refreshToken,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error,
  })),

  // Register
  on(AuthActions.registerRequest, (state, { email }) => ({
    ...state,
    isLoading: true,
    error: null,
    pendingVerificationEmail: email,
  })),

  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    pendingVerificationEmail: null,
  })),

  // Verify Email
  on(AuthActions.verifyEmailRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.verifyEmailSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
    pendingVerificationEmail: null,
  })),
  on(AuthActions.verifyEmailFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Resend Verification
  on(AuthActions.resendVerificationRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.resendVerificationSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.resendVerificationFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
  })),

  // Refresh Token
  on(AuthActions.refreshTokenSuccess, (state, { accessToken, refreshToken }) => ({
    ...state,
    token: accessToken,
    refreshToken,
  })),

  on(AuthActions.refreshTokenFailure, () => ({
    ...initialAuthState,
  })),

  // User Profile
  on(AuthActions.loadUserProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update Profile
  on(AuthActions.updateProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Forgot Password
  on(AuthActions.forgotPassword, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Reset Password
  on(AuthActions.resetPassword, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.resetPasswordSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Change Password
  on(AuthActions.changePassword, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.changePasswordSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Utility
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(AuthActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading,
  }))
);
