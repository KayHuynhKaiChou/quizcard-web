# Phase 1: Update NgRx Auth Store

## Context Links
- Parent: [plan.md](plan.md)
- Auth actions: [auth.actions.ts](../../src/app/store/auth/auth.actions.ts)
- Auth state: [auth.state.ts](../../src/app/store/auth/auth.state.ts)
- Auth reducer: [auth.reducer.ts](../../src/app/store/auth/auth.reducer.ts)
- Auth selectors: [auth.selectors.ts](../../src/app/store/auth/auth.selectors.ts)
- Auth effects: [auth.effects.ts](../../src/app/store/auth/auth.effects.ts)

## Overview
- **Priority**: P1
- **Status**: Complete
- **Description**: Add verifyEmail and resendVerification NgRx actions, state fields, reducer handlers, selectors, and effects

## Key Insights
- Existing pattern: request/success/failure triplet for all async auth operations
- Effects use `switchMap` for cancellable ops, `tap` for toasts/navigation
- `registerSuccess$` currently navigates to `/signin` — must change to `/verify-email-sent`
- `registerRequest` already sends `{ email, password, displayName }` — email is available in the action payload

## Requirements
- Store `pendingVerificationEmail` in auth state after successful registration
- `verifyEmail$` effect: POST token, receive AuthResponse, auto-login
- `resendVerification$` effect: POST email, show toast on success
- Update `registerSuccess$` to navigate to `/verify-email-sent`

## Related Code Files

### Modified
- `src/app/store/auth/auth.state.ts`
- `src/app/store/auth/auth.actions.ts`
- `src/app/store/auth/auth.reducer.ts`
- `src/app/store/auth/auth.selectors.ts`
- `src/app/store/auth/auth.effects.ts`

## Implementation Steps

### 1. Update `auth.state.ts`
Add field to `AuthState`:
```typescript
pendingVerificationEmail: string | null;
```
Update `initialAuthState`:
```typescript
pendingVerificationEmail: null,
```

### 2. Update `auth.actions.ts`
Add 6 new actions after existing register actions:

```typescript
// Verify Email
export const verifyEmailRequest = createAction(
  '[Auth] Verify Email Request',
  props<{ token: string }>()
);
export const verifyEmailSuccess = createAction(
  '[Auth] Verify Email Success',
  props<{ accessToken: string; refreshToken: string }>()
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
```

### 3. Update `auth.reducer.ts`
Add handlers:

```typescript
// Store pending email on register request (email comes from action payload)
on(AuthActions.registerRequest, (state, { email }) => ({
  ...state,
  isLoading: true,
  error: null,
  pendingVerificationEmail: email,
})),

// Keep pendingVerificationEmail on registerSuccess (already set)
on(AuthActions.registerSuccess, (state) => ({
  ...state,
  isLoading: false,
  error: null,
})),

// Verify Email
on(AuthActions.verifyEmailRequest, (state) => ({
  ...state,
  isLoading: true,
  error: null,
})),
on(AuthActions.verifyEmailSuccess, (state, { accessToken, refreshToken }) => ({
  ...state,
  token: accessToken,
  refreshToken,
  isAuthenticated: true,
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
```

**Note**: Update existing `registerRequest` handler to also set `pendingVerificationEmail: email`. The `email` field is already in the action props (from `RegisterRequest`).

### 4. Update `auth.selectors.ts`
Add:
```typescript
export const selectPendingVerificationEmail = createSelector(
  selectAuthState,
  (state: AuthState) => state.pendingVerificationEmail
);
```

### 5. Update `auth.effects.ts`

#### Add `verifyEmail$` effect:
```typescript
verifyEmail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.verifyEmailRequest),
    tap(() => this.loadingService.show()),
    switchMap(({ token }) =>
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/verify-email`, { token }).pipe(
        switchMap((response) =>
          // Auto-login: fetch user profile with new token
          this.http.get<User>(`${this.apiUrl}/users/me`, {
            headers: { Authorization: `Bearer ${response.accessToken}` }
          }).pipe(
            map((user) => AuthActions.loginSuccess({
              user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            }))
          )
        ),
        catchError((error) =>
          of(AuthActions.verifyEmailFailure({
            error: error.error?.message || 'Xác minh email thất bại'
          }))
        ),
        finalize(() => this.loadingService.hide())
      )
    )
  )
);
```

**Key**: On verify success, dispatch `loginSuccess` (reuses existing login flow — reducer sets user/token/isAuthenticated, effect navigates to dashboard, toast shows).

#### Add `resendVerification$` effect:
```typescript
resendVerification$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.resendVerificationRequest),
    switchMap(({ email }) =>
      this.http.post<MessageResponse>(`${this.apiUrl}/auth/resend-verification`, { email }).pipe(
        map((response) => AuthActions.resendVerificationSuccess({ message: response.message })),
        catchError((error) =>
          of(AuthActions.resendVerificationFailure({
            error: error.error?.message || 'Gửi lại email thất bại'
          }))
        )
      )
    )
  )
);

resendVerificationSuccess$ = createEffect(() =>
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
```

#### Update `registerSuccess$` effect:
Change navigation from `/signin` to `/verify-email-sent`:
```typescript
// BEFORE:
this.router.navigate(['/signin']);

// AFTER:
this.router.navigate(['/verify-email-sent']);
```

## Todo List
- [x] Update auth.state.ts — add pendingVerificationEmail field
- [x] Update auth.actions.ts — add 6 new actions
- [x] Update auth.reducer.ts — add handlers for new actions + update registerRequest handler
- [x] Update auth.selectors.ts — add selectPendingVerificationEmail
- [x] Update auth.effects.ts — add verifyEmail$, resendVerification$, update registerSuccess$
- [x] Run `ng build` to verify no compile errors

## Success Criteria
- All new actions, reducer handlers, selectors compile without errors
- `registerSuccess$` navigates to `/verify-email-sent`
- `verifyEmail$` calls API and dispatches `loginSuccess` on success (reuses login flow)
- `resendVerification$` calls API and shows toast on success

## Risk Assessment
- If backend verify-email returns `MessageResponse` instead of `AuthResponse`, the `verifyEmail$` effect will fail on `switchMap` to fetch user. **Mitigation**: Add type guard or try-catch, fallback to navigating to `/signin`.
- `registerRequest` action must already contain `email` in props. Verified: `RegisterRequest { email, password, displayName }` — confirmed.

## Security Considerations
- Token from URL query param is sent only via POST body, never stored in state long-term
- `pendingVerificationEmail` is cleared on successful verification
- Both endpoints are already whitelisted in interceptor — no auth header sent

## Next Steps
→ Phase 2: Update AuthService facade & add VerifyEmailRequest type
