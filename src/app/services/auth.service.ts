import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = inject(Store<AppState>);

  // Selectors as observables
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  user$ = this.store.select(AuthSelectors.selectUser);
  token$ = this.store.select(AuthSelectors.selectToken);
  isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
  error$ = this.store.select(AuthSelectors.selectError);
  pendingVerificationEmail$ = this.store.select(AuthSelectors.selectPendingVerificationEmail);

  login(credentials: LoginRequest): void {
    this.store.dispatch(AuthActions.loginRequest(credentials));
  }

  register(data: RegisterRequest): void {
    this.store.dispatch(AuthActions.registerRequest(data));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  loadUserProfile(): void {
    this.store.dispatch(AuthActions.loadUserProfile());
  }

  forgotPassword(data: ForgotPasswordRequest): void {
    this.store.dispatch(AuthActions.forgotPassword(data));
  }

  resetPassword(data: ResetPasswordRequest): void {
    this.store.dispatch(AuthActions.resetPassword(data));
  }

  changePassword(data: ChangePasswordRequest): void {
    this.store.dispatch(AuthActions.changePassword(data));
  }

  verifyEmail(token: string): void {
    this.store.dispatch(AuthActions.verifyEmailRequest({ token }));
  }

  resendVerification(email: string): void {
    this.store.dispatch(AuthActions.resendVerificationRequest({ email }));
  }

  refreshToken(): void {
    this.store.dispatch(AuthActions.refreshToken());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  // Synchronous getters (for interceptors/guards)
  getToken(): string | null {
    let token: string | null = null;
    this.store
      .select(AuthSelectors.selectToken)
      .subscribe((t) => (token = t))
      .unsubscribe();
    return token;
  }

  getRefreshToken(): string | null {
    let token: string | null = null;
    this.store
      .select(AuthSelectors.selectRefreshToken)
      .subscribe((t) => (token = t))
      .unsubscribe();
    return token;
  }

  getCurrentUser() {
    let user = null;
    this.store
      .select(AuthSelectors.selectUser)
      .subscribe((u) => (user = u))
      .unsubscribe();
    return user;
  }

  hasRole(role: string): Observable<boolean> {
    return this.store.select(AuthSelectors.selectHasRole(role));
  }

  isAdmin(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsAdmin);
  }
}
