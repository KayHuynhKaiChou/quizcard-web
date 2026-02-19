# Phase 2: Auth Pages & Store

## Context
- **Parent plan**: [plan.md](./plan.md)
- **Dependencies**: Phase 1 (design tokens)
- **Docs**: [PRD Section 2.1, 4.6](../../docs/requirement.md)

## Overview
- **Date**: 2026-02-18
- **Description**: Build register, verify-email, forgot-password, reset-password pages + update signin + expand auth NgRx store
- **Priority**: P0
- **Effort**: 8h
- **Implementation status**: pending
- **Review status**: pending

## Key Insights
- Current auth store only handles login/logout/profile — needs register, verify, forgot/reset
- PRD requires email-based auth (not username) with email verification flow
- Current signin uses `username` field — must change to `email`
- All new auth pages use AuthLayout (split layout: left branding, right form)
- API endpoints follow `/api/auth/*` pattern per PRD Section 5.4

## Requirements
1. Add new auth actions: registerRequest/Success/Failure, verifyEmail, forgotPassword, resetPassword
2. Add new auth effects for API calls
3. Create Register page (email + password + display name → "check email")
4. Create Verify Email page (success/expired/resend)
5. Create Forgot Password page (email input → confirmation)
6. Create Reset Password page (new password + confirm, token from URL)
7. Update Sign-in page: email field, "Forgot password?" link, "Register" link
8. Update auth interceptor public URLs list
9. Add new routes under AuthLayout

## Architecture

```
AuthLayout
├── /signin        → SigninPage (modified: email, links)
├── /register      → RegisterPage (new)
├── /verify-email  → VerifyEmailPage (new)
├── /forgot-password → ForgotPasswordPage (new)
└── /reset-password  → ResetPasswordPage (new)
```

### Auth Store Extension
```
AuthActions (new):
├── registerRequest({ email, password, displayName })
├── registerSuccess({ message })
├── registerFailure({ error })
├── verifyEmailRequest({ token })
├── verifyEmailSuccess()
├── verifyEmailFailure({ error })
├── forgotPasswordRequest({ email })
├── forgotPasswordSuccess({ message })
├── forgotPasswordFailure({ error })
├── resetPasswordRequest({ token, newPassword })
├── resetPasswordSuccess()
└── resetPasswordFailure({ error })
```

## Related Code Files

### Modify
- `src/app/store/auth/auth.actions.ts` — add new actions
- `src/app/store/auth/auth.reducer.ts` — handle new actions
- `src/app/store/auth/auth.effects.ts` — add new effects
- `src/app/store/auth/auth.state.ts` — add registrationSuccess, verificationStatus fields
- `src/app/pages/signin/signin.ts` — change username→email, add links
- `src/app/pages/signin/signin.html` — update template
- `src/app/layouts/auth/auth.html` — may need layout adjustments
- `src/app/app.routes.ts` — add 4 new routes
- `src/app/interceptors/auth.interceptor.ts` — add new public URLs
- `src/app/types/index.ts` — add RegisterRequest, ResetPasswordRequest interfaces

### Create (new files)
- `src/app/pages/register/register.ts` + `.html` + `.scss`
- `src/app/pages/verify-email/verify-email.ts` + `.html` + `.scss`
- `src/app/pages/forgot-password/forgot-password.ts` + `.html` + `.scss`
- `src/app/pages/reset-password/reset-password.ts` + `.html` + `.scss`

## Implementation Steps

### Step 1: Extend types
Add to `types/index.ts`:
```typescript
export interface RegisterRequest { email: string; password: string; displayName: string; }
export interface ForgotPasswordRequest { email: string; }
export interface ResetPasswordRequest { token: string; newPassword: string; }
```

### Step 2: Extend auth store
Add new actions following existing pattern. Add state fields:
```typescript
registrationMessage: string | null; // "Check your email"
verificationStatus: 'pending' | 'success' | 'expired' | null;
resetPasswordStatus: 'pending' | 'success' | 'expired' | null;
```

### Step 3: Add auth effects
Follow existing `login$` pattern. API endpoints:
- POST `/api/auth/register` → registerSuccess
- POST `/api/auth/verify-email` → verifyEmailSuccess
- POST `/api/auth/forgot-password` → forgotPasswordSuccess
- POST `/api/auth/reset-password` → resetPasswordSuccess

### Step 4: Create Register page
- Reactive form: email (required, email validator), password (required, minLength 8), displayName (required)
- PrimeNG: InputText, Password (with strength meter), Button, Message
- On submit: dispatch registerRequest → show "Check email" message on success

### Step 5: Create Verify Email page
- Read `token` from URL query params
- On init: dispatch verifyEmailRequest({ token })
- Show success state or expired state with "Resend" button

### Step 6: Create Forgot Password page
- Reactive form: email (required, email validator)
- On submit: dispatch forgotPasswordRequest → show confirmation

### Step 7: Create Reset Password page
- Read `token` from URL query params
- Reactive form: newPassword + confirmPassword (must match)
- On submit: dispatch resetPasswordRequest

### Step 8: Update Sign-in page
- Change `username` field to `email` field
- Add "Quên mật khẩu?" link → `/forgot-password`
- Add "Chưa có tài khoản? Đăng ký" link → `/register`

### Step 9: Update routes
```typescript
{ path: 'register', component: RegisterPage },
{ path: 'verify-email', component: VerifyEmailPage },
{ path: 'forgot-password', component: ForgotPasswordPage },
{ path: 'reset-password', component: ResetPasswordPage },
```

### Step 10: Update interceptor
Add to public URLs: `/api/auth/register`, `/api/auth/verify-email`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/resend-verification`

## Todo
- [ ] Extend types/index.ts with new interfaces
- [ ] Add new auth actions (register, verify, forgot, reset)
- [ ] Update auth state with new fields
- [ ] Update auth reducer for new actions
- [ ] Add new auth effects for API calls
- [ ] Create Register page (form + template + styles)
- [ ] Create Verify Email page
- [ ] Create Forgot Password page
- [ ] Create Reset Password page
- [ ] Update Sign-in page (email field, links)
- [ ] Add routes to app.routes.ts
- [ ] Update auth interceptor public URLs

## Success Criteria
- All 4 new auth pages render correctly
- Forms validate with proper error messages (Vietnamese)
- Sign-in page uses email instead of username
- Navigation between auth pages works (links)
- NgRx actions dispatch correctly (verify in DevTools)
- SSR-safe (no browser API usage in auth pages)

## Security Considerations
- Password fields use PrimeNG Password with toggle mask
- Minimum password length: 8 characters
- Reset password token read from URL, not stored
- No sensitive data logged in effects

## Risk Assessment
| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Backend API not ready | High | Mock responses in effects, show UI correctly |
| Email verification flow complex | Low | Keep UI simple: show status message |

## Next Steps
Phase 3 (Home & Shared Components) can start in parallel after Phase 1 completes.
