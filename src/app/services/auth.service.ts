import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private store = inject(Store<AppState>);

  // Selectors as observables
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  user$ = this.store.select(AuthSelectors.selectUser);
  token$ = this.store.select(AuthSelectors.selectToken);
  isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
  error$ = this.store.select(AuthSelectors.selectError);

  // Login method - dispatches action instead of direct API call
  login(credentials: LoginRequest): void {
    // dispatch() nhận 1 param là 1 action obj có dạng {username,password,type:"[Auth] Login Request"}
    // Effect lắng nghe qua ofType()
    this.store.dispatch(AuthActions.loginRequest({
      username: credentials.username,
      password: credentials.password
    }));
  }

  // Logout method - dispatches action
  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  // Load user profile
  loadUserProfile(): void {
    this.store.dispatch(AuthActions.loadUserProfile());
  }

  // Clear error
  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  // Get current token synchronously (for HTTP interceptors)
  getToken(): string | null {
    let token: string | null = null;
    this.store.select(AuthSelectors.selectToken).subscribe(t => token = t).unsubscribe();
    return token;
  }

  // Get current user synchronously
  getCurrentUser() {
    let user = null;
    this.store.select(AuthSelectors.selectUser).subscribe(u => user = u).unsubscribe();
    return user;
  }

  // Check if user has specific role
  hasRole(role: string): Observable<boolean> {
    return this.store.select(AuthSelectors.selectHasRole(role));
  }

  // Check if user is admin
  isAdmin(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsAdmin);
  }
}
