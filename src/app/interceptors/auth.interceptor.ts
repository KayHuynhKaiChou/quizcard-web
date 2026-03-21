import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import * as AuthActions from '../store/auth/auth.actions';
import { AuthResponse } from '../types';
import { environment } from '../../environments/environment';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const store = inject(Store);
  const http = inject(HttpClient);

  // Public endpoints that don't need Authorization header
  const publicPatterns = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/resend-verification',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/refresh',
    '/api/auth/logout',
    '/api/explore/',
    '/api/health',
  ];

  const isPublicUrl = publicPatterns.some((pattern) => req.url.includes(pattern));

  if (isPublicUrl) {
    return next(req);
  }

  const token = authService.getToken();

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handleTokenRefresh(authService, store, http, req, next);
      }
      return throwError(() => error);
    })
  );
};

function handleTokenRefresh(
  authService: AuthService,
  store: Store,
  http: HttpClient,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      store.dispatch(AuthActions.logout());
      return throwError(() => new Error('No refresh token'));
    }

    return http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        switchMap((response) => {
          isRefreshing = false;

          // Update store with new tokens
          store.dispatch(
            AuthActions.refreshTokenSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            })
          );

          refreshTokenSubject.next(response.accessToken);

          // Retry original request with new token
          const retryReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`),
          });
          return next(retryReq);
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          refreshTokenSubject.next(null);
          store.dispatch(AuthActions.logout());
          return throwError(() => refreshError);
        })
      );
  }

  // If already refreshing, wait for the new token then retry
  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => {
      const retryReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next(retryReq);
    })
  );
}
