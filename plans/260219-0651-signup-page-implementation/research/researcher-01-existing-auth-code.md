# Research Report: Existing Auth Code Analysis

## Summary
Full register flow already exists in NgRx store. Only UI component and route are missing.

## What Already Exists

| Component | Status | File |
|-----------|--------|------|
| Register Actions | Done | `auth.actions.ts` - registerRequest, registerSuccess, registerFailure |
| Register Effect | Done | `auth.effects.ts:63-87` - POST to `/api/auth/register`, toast, navigation |
| Register Reducer | Done | `auth.reducer.ts:35-52` - isLoading, error state handling |
| Register Selectors | Done | `auth.selectors.ts` - selectIsLoading, selectError |
| RegisterRequest Type | Done | `types/index.ts:18-22` - email, password, displayName |
| Auth Service Method | Done | `auth.service.ts:32-34` - `register(data)` dispatches action |
| HTTP Whitelisting | Done | `auth.interceptor.ts:11` - `/api/auth/register` is public |
| Auth Layout | Done | `layouts/auth/` - two-column layout with router-outlet |
| Loading Service | Done | `services/loading.service.ts` - show/hide loading |
| Toast Notifications | Done | PrimeNG MessageService in effects |

## What's Missing

1. **Signup Page Component** - `src/app/pages/signup/signup.ts` + `.html` + `.scss`
2. **Signup Route** - No `/signup` route in `app.routes.ts`
3. **Navigation Links** - No "Create account" link on signin page, no "Already have account?" on signup
4. **Password Confirmation** - UI-side only validation, not in RegisterRequest type

## Register Effect Details
- On submit: shows loading toast "Đang đăng ký..."
- POST to `/api/auth/register` with {email, password, displayName}
- On success: dispatches registerSuccess, shows success toast, navigates to `/signin` after 2s
- On failure: dispatches registerFailure with error message

## Auth Layout Structure
```html
<section class="bl_auth">
  <div class="bl_auth__part bl_part_left"><!-- Branding --></div>
  <div class="bl_auth__part bl_part_right"><router-outlet></router-outlet></div>
</section>
```
