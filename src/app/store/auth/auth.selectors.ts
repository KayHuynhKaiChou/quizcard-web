import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';
import { Role } from '../../types/enum';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectToken = createSelector(selectAuthState, (state) => state.token);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state) => state.refreshToken
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectIsLoading = createSelector(selectAuthState, (state) => state.isLoading);

export const selectError = createSelector(selectAuthState, (state) => state.error);

export const selectPendingVerificationEmail = createSelector(
  selectAuthState,
  (state: AuthState) => state.pendingVerificationEmail
);

// Computed selectors
export const selectUserRole = createSelector(selectUser, (user) => user?.role);

export const selectUserName = createSelector(selectUser, (user) => user?.displayName);

export const selectUserEmail = createSelector(selectUser, (user) => user?.email);

export const selectUserId = createSelector(selectUser, (user) => user?.id);

// Combined selectors
export const selectAuthInfo = createSelector(
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  (user, token, isAuthenticated, isLoading) => ({
    user,
    token,
    isAuthenticated,
    isLoading,
  })
);

export const selectLoginState = createSelector(
  selectIsLoading,
  selectError,
  (isLoading, error) => ({
    isLoading,
    error,
  })
);

// Role checks
export const selectHasRole = (role: string) =>
  createSelector(selectUserRole, (userRole) => userRole === role);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === Role.ADMIN
);
