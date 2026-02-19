import { createAction, props } from '@ngrx/store';
import {
  User,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  MessageResponse,
} from '../../types';

// Login Actions
export const loginRequest = createAction('[Auth] Login Request', props<LoginRequest>());

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Register Actions
export const registerRequest = createAction('[Auth] Register Request', props<RegisterRequest>());

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ message: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Verify Email
export const verifyEmailRequest = createAction(
  '[Auth] Verify Email Request',
  props<{ token: string }>()
);
export const verifyEmailSuccess = createAction(
  '[Auth] Verify Email Success',
  props<{ message: string }>()
);
export const verifyEmailFailure = createAction(
  '[Auth] Verify Email Failure',
  props<{ error: string }>()
);

// Resend Verification
export const resendVerificationRequest = createAction(
  '[Auth] Resend Verification Request',
  props<{ email: string }>()
);
export const resendVerificationSuccess = createAction(
  '[Auth] Resend Verification Success',
  props<{ message: string }>()
);
export const resendVerificationFailure = createAction(
  '[Auth] Resend Verification Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

// Refresh Token
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string; refreshToken: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

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

// Update Profile
export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ data: UpdateProfileRequest }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

// Forgot Password
export const forgotPassword = createAction(
  '[Auth] Forgot Password',
  props<ForgotPasswordRequest>()
);

export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success',
  props<{ message: string }>()
);

export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: string }>()
);

// Reset Password
export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<ResetPasswordRequest>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success',
  props<{ message: string }>()
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);

// Change Password
export const changePassword = createAction(
  '[Auth] Change Password',
  props<ChangePasswordRequest>()
);

export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success',
  props<{ message: string }>()
);

export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: string }>()
);

// Utility Actions
export const clearError = createAction('[Auth] Clear Error');

export const setLoading = createAction('[Auth] Set Loading', props<{ isLoading: boolean }>());

export const initializeAuth = createAction('[Auth] Initialize Auth');
