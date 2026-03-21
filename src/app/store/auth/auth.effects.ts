import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.state';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { AuthResponse, MessageResponse, User } from '../../types';

@Injectable()
export class AuthEffects {
  private readonly API = environment.apiUrl;

  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private store = inject(Store<{ auth: AuthState }>);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      tap(() => this.loadingService.show('Đang đăng nhập...')),
      switchMap(({ email, password }) =>
        this.http
          .post<AuthResponse>(`${this.API}/auth/login`, { email, password })
          .pipe(
            switchMap((authResponse) =>
              // After login, fetch user profile
              this.http.get<User>(`${this.API}/users/me`, {
                headers: { Authorization: `Bearer ${authResponse.accessToken}` },
              }).pipe(
                map((user) =>
                  AuthActions.loginSuccess({
                    user,
                    accessToken: authResponse.accessToken,
                    refreshToken: authResponse.refreshToken,
                  })
                )
              )
            ),
            catchError((error) =>
              of(
                AuthActions.loginFailure({
                  error: error.error?.message || 'Đăng nhập thất bại',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  // Register Effect
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerRequest),
      tap(() => this.loadingService.show('Đang đăng ký...')),
      switchMap(({ email, password, displayName }) =>
        this.http
          .post<MessageResponse>(`${this.API}/auth/register`, {
            email,
            password,
            displayName,
          })
          .pipe(
            map((response) => AuthActions.registerSuccess({ message: response.message })),
            catchError((error) =>
              of(
                AuthActions.registerFailure({
                  error: error.error?.message || 'Đăng ký thất bại',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  // Logout Effect - calls backend API
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        let refreshToken: string | null = null;
        this.store
          .select((state) => state.auth.refreshToken)
          .subscribe((t) => (refreshToken = t))
          .unsubscribe();

        if (refreshToken) {
          return this.http
            .post<MessageResponse>(`${this.API}/auth/logout`, { refreshToken })
            .pipe(
              map(() => AuthActions.logoutSuccess()),
              catchError(() => of(AuthActions.logoutSuccess()))
            );
        }
        return of(AuthActions.logoutSuccess());
      })
    )
  );

  // Refresh Token Effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() => {
        let refreshToken: string | null = null;
        this.store
          .select((state) => state.auth.refreshToken)
          .subscribe((t) => (refreshToken = t))
          .unsubscribe();

        if (!refreshToken) {
          return of(AuthActions.refreshTokenFailure({ error: 'No refresh token' }));
        }

        return this.http
          .post<AuthResponse>(`${this.API}/auth/refresh`, { refreshToken })
          .pipe(
            map((response) =>
              AuthActions.refreshTokenSuccess({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              })
            ),
            catchError((error) =>
              of(
                AuthActions.refreshTokenFailure({
                  error: error.error?.message || 'Token refresh failed',
                })
              )
            )
          );
      })
    )
  );

  // Load User Profile Effect
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserProfile),
      tap(() => this.loadingService.show('Đang tải thông tin...')),
      switchMap(() =>
        this.http.get<User>(`${this.API}/users/me`).pipe(
          map((user) => AuthActions.loadUserProfileSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.loadUserProfileFailure({
                error: error.error?.message || 'Tải thông tin thất bại',
              })
            )
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  // Update Profile Effect
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      tap(() => this.loadingService.show('Đang cập nhật...')),
      switchMap(({ data }) =>
        this.http.put<User>(`${this.API}/users/me`, data).pipe(
          map((user) => AuthActions.updateProfileSuccess({ user })),
          catchError((error) =>
            of(AuthActions.updateProfileFailure({
              error: error.error?.message || 'Cập nhật thất bại',
            }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  updateProfileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.updateProfileSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật thành công',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  // Upload Avatar Effect
  uploadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.uploadAvatar),
      tap(() => this.loadingService.show('Đang tải ảnh...')),
      switchMap(({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<User>(`${this.API}/users/me/avatar`, formData).pipe(
          map((user) => AuthActions.uploadAvatarSuccess({ user })),
          catchError((error) =>
            of(AuthActions.uploadAvatarFailure({ error: error.error?.message || 'Tải ảnh thất bại' }))
          ),
          finalize(() => this.loadingService.hide()),
        );
      })
    )
  );

  uploadAvatarSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.uploadAvatarSuccess),
        tap(() =>
          this.messageService.add({ severity: 'success', summary: 'Cập nhật ảnh thành công', life: 3000 })
        )
      ),
    { dispatch: false }
  );

  // Forgot Password Effect
  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      tap(() => this.loadingService.show('Đang gửi email...')),
      switchMap(({ email }) =>
        this.http
          .post<MessageResponse>(`${this.API}/auth/forgot-password`, { email })
          .pipe(
            map((response) => AuthActions.forgotPasswordSuccess({ message: response.message })),
            catchError((error) =>
              of(
                AuthActions.forgotPasswordFailure({
                  error: error.error?.message || 'Gửi email thất bại',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  // Reset Password Effect
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      tap(() => this.loadingService.show('Đang đặt lại mật khẩu...')),
      switchMap(({ token, newPassword }) =>
        this.http
          .post<MessageResponse>(`${this.API}/auth/reset-password`, { token, newPassword })
          .pipe(
            map((response) => AuthActions.resetPasswordSuccess({ message: response.message })),
            catchError((error) =>
              of(
                AuthActions.resetPasswordFailure({
                  error: error.error?.message || 'Đặt lại mật khẩu thất bại',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  // Change Password Effect
  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      tap(() => this.loadingService.show('Đang đổi mật khẩu...')),
      switchMap(({ oldPassword, newPassword }) =>
        this.http
          .put<MessageResponse>(`${this.API}/auth/change-password`, {
            oldPassword,
            newPassword,
          })
          .pipe(
            map((response) => AuthActions.changePasswordSuccess({ message: response.message })),
            catchError((error) =>
              of(
                AuthActions.changePasswordFailure({
                  error: error.error?.message || 'Đổi mật khẩu thất bại',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  // Verify Email Effect
  verifyEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyEmailRequest),
      tap(() => this.loadingService.show('Đang xác minh email...')),
      switchMap(({ token }) =>
        this.http
          .post<MessageResponse>(`${this.API}/auth/verify-email?token=${token}`, {})
          .pipe(
            map((response) =>
              AuthActions.verifyEmailSuccess({ message: response.message })
            ),
            catchError((error) =>
              of(
                AuthActions.verifyEmailFailure({
                  error: error.error?.message || 'Xác minh email thất bại',
                })
              )
            ),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  // Resend Verification Effect
  resendVerification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resendVerificationRequest),
      switchMap(({ email }) =>
        this.http
          .post<MessageResponse>(`${this.API}/auth/resend-verification`, { email })
          .pipe(
            map((response) =>
              AuthActions.resendVerificationSuccess({ message: response.message })
            ),
            catchError((error) =>
              of(
                AuthActions.resendVerificationFailure({
                  error: error.error?.message || 'Gửi lại email thất bại',
                })
              )
            )
          )
      )
    )
  );

  resendVerificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resendVerificationSuccess),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: message || 'Email xác minh đã được gửi lại',
            life: 5000,
          });
        })
      ),
    { dispatch: false }
  );

  // Navigation Effects
  verifyEmailSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.verifyEmailSuccess),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Xác minh thành công',
            detail: message || 'Email đã được xác minh. Vui lòng đăng nhập.',
            life: 5000,
          });
          this.router.navigate(['/signin']);
        })
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đăng nhập thành công',
            detail: 'Chào mừng bạn trở lại!',
            life: 3000,
          });
          setTimeout(() => this.router.navigate(['/']), 1000);
        })
      ),
    { dispatch: false }
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đăng ký thành công',
            detail: message || 'Vui lòng kiểm tra email để xác thực tài khoản.',
            life: 5000,
          });
          this.router.navigate(['/verify-email-sent']);
        })
      ),
    { dispatch: false }
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/signin']))
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Đăng nhập thất bại',
            detail: error || 'Email hoặc mật khẩu không đúng',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  forgotPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.forgotPasswordSuccess),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Email đã gửi',
            detail: message,
            life: 5000,
          });
        })
      ),
    { dispatch: false }
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đặt lại mật khẩu thành công',
            detail: message || 'Vui lòng đăng nhập với mật khẩu mới.',
            life: 5000,
          });
          this.router.navigate(['/signin']);
        })
      ),
    { dispatch: false }
  );

  changePasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.changePasswordSuccess),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Đổi mật khẩu thành công',
            detail: message || 'Vui lòng đăng nhập lại với mật khẩu mới',
            life: 2500,
          });
          setTimeout(() => this.store.dispatch(AuthActions.logout()), 2000);
        })
      ),
    { dispatch: false }
  );
}
