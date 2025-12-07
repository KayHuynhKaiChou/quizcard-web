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
import { ApiResponse, User } from '../../types';

@Injectable()
export class AuthEffects {
  private readonly API_BASE_URL = environment.apiUrl;

  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private store = inject(Store<{ auth: AuthState }>);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);

  // Note: localStorage persistence is handled by ngrx-store-localstorage meta reducer

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      // giúp filter action có type loginRequest.
      ofType(AuthActions.loginRequest),
      tap(() => this.loadingService.show('Đang đăng nhập...')),
      // case user lỡ nhấn nút login nhiều lần, switchMap() sẽ cancel các request trước đó và chỉ lấy request mới nhất
      // switchMap() // ✅ Code hiện tại: Hủy request cũ
      // mergeMap() // ❌ Chạy tất cả requests song song
      // exhaustMap() // ❌ Bỏ qua requests mới khi đang có request đang chạy
      // concatMap() // ❌ Queue tất cả requests
      switchMap(({ username, password }) =>
        this.http.post<ApiResponse<User>>(
          `${this.API_BASE_URL}/account/sign-in`,
          { username, password }
        ).pipe(
          map((response) => 
            // map đang return 1 action obj có dạng {user,token,type:"[Auth] Login Success"}
            // Effect tự động dispatch action loginSuccess mà ko cần store.dispatch()
            // muốn ngăn auto dispatch của effect thì use { dispatch: false }
            // sau khi dispatch thì reducer tương ứng sẽ chạy và 2 effect loginSuccess$ và persistToken$ sẽ chạy luôn
            {
              return AuthActions.loginSuccess({
                user: response.result,
                token: response.result.token || ''
              })
            }
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ 
              error: error.error?.message || 'Login failed' 
            }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  // Logout Effect - Just update state locally, no API call needed
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(AuthActions.logoutSuccess()))
    )
  );

  // Load User Profile Effect
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserProfile),
      tap(() => this.loadingService.show('Đang tải thông tin...')),
      switchMap(() =>
        this.store.select(state => state.auth.token).pipe(
          switchMap((token) => {
            if (!token) {
              return of(AuthActions.loadUserProfileFailure({ error: 'No token available' }));
            }
            
            // AuthInterceptor will automatically add Authorization header
            return this.http.get<any>(`${this.API_BASE_URL}/account/profile`).pipe(
              map((user) => AuthActions.loadUserProfileSuccess({ user })),
              catchError((error) =>
                of(AuthActions.loadUserProfileFailure({ 
                  error: error.error?.message || 'Failed to load user profile' 
                }))
              ),
              finalize(() => this.loadingService.hide())
            );
          })
        )
      )
    )
  );

  // Navigation Effects
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Đăng nhập thành công',
          detail: 'Chào mừng bạn trở lại!',
          life: 3000
        });
        
        // Navigate after 1 second
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      })
    ),
    { dispatch: false } // bắt buộc phải có dòng này khi effect này ko có dispatch 1 action khác
  );

  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        this.router.navigate(['/signin']); // Redirect to login after logout
      })
    ),
    { dispatch: false }
  );

  // Show error message on login failure
  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(({ error }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Đăng nhập thất bại',
          detail: error || 'Tên đăng nhập hoặc mật khẩu không đúng',
          life: 3000
        });
      })
    ),
    { dispatch: false }
  );
}
