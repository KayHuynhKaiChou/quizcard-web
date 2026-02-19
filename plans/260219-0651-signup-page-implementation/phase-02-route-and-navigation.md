# Phase 02 — Route and Navigation

## Context Links

- Routes file: `src/app/app.routes.ts`
- Signin template: `src/app/pages/signin/signin.html`
- Signup template (created in Phase 01): `src/app/pages/signup/signup.html`
- Auth layout: `src/app/layouts/auth/auth` — already wraps both signin and signup

## Overview

- **Priority**: High
- **Status**: Pending (depends on Phase 01)
- **Description**: Wire the signup page into the router and add cross-navigation links between signin and signup pages.

## Key Insights

- The `/signup` route must be a child of `AuthLayoutComponent` (same pattern as `/signin`) so the two-column auth layout wraps it.
- `SignupPage` is a standalone component — import it directly, no lazy loading needed (same pattern as `SigninPage`).
- `signin.html` needs `RouterLink` imported in `signin.ts` to support the navigation link.
- The "Đã có tài khoản? Đăng nhập" link in `signup.html` is already included in Phase 01 template — no change needed there.

## Requirements

### Functional
- `GET /signup` renders `SignupPage` inside `AuthLayoutComponent`
- Signin page shows "Chưa có tài khoản? Đăng ký" link pointing to `/signup`
- Signup page shows "Đã có tài khoản? Đăng nhập" link pointing to `/signin` (already in Phase 01 template)

### Non-functional
- No lazy loading for signup (consistent with signin eager import)
- Route added without breaking existing routes

## Architecture

```
Routes tree (after change):
  /signin  → AuthLayoutComponent > SigninPage
  /signup  → AuthLayoutComponent > SignupPage   ← NEW
  /        → MainLayoutComponent > (protected routes)
```

## Related Code Files

### Files to Modify
- `src/app/app.routes.ts` — add `/signup` route child, import `SignupPage`
- `src/app/pages/signin/signin.ts` — add `RouterLink` to imports
- `src/app/pages/signin/signin.html` — add footer navigation link

### Files to Read (reference, do not modify)
- `src/app/pages/signup/signup.ts` (created in Phase 01)

## Implementation Steps

### Step 1 — Update `src/app/app.routes.ts`

Add `SignupPage` import and child route under `AuthLayoutComponent`.

**Before** (lines 1-17):
```typescript
import { Routes } from '@angular/router';
import { SigninPage } from './pages/signin/signin';
import { MainLayoutComponent } from './layouts/main/main';
import { AuthLayoutComponent } from './layouts/auth/auth';
import { DashboardPage } from './pages/dashboard/dashboard';
import { LibraryComponent } from './pages/library/library';
import { NotificationsComponent } from './pages/notifications/notifications';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'signin',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: SigninPage },
    ],
  },
```

**After**:
```typescript
import { Routes } from '@angular/router';
import { SigninPage } from './pages/signin/signin';
import { SignupPage } from './pages/signup/signup';
import { MainLayoutComponent } from './layouts/main/main';
import { AuthLayoutComponent } from './layouts/auth/auth';
import { DashboardPage } from './pages/dashboard/dashboard';
import { LibraryComponent } from './pages/library/library';
import { NotificationsComponent } from './pages/notifications/notifications';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'signin',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: SigninPage },
    ],
  },
  {
    path: 'signup',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: SignupPage },
    ],
  },
```

### Step 2 — Update `src/app/pages/signin/signin.ts`

Add `RouterLink` to imports array so the template can use `routerLink`.

**Before** (imports array):
```typescript
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
```

**After**:
```typescript
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
```

And add `RouterLink` to the `imports` array in `@Component`:
```typescript
imports: [
  CommonModule,
  RouterLink,       // ← add this
  ButtonModule,
  InputTextModule,
  PasswordModule,
  MessageModule,
  ReactiveFormsModule,
],
```

### Step 3 — Update `src/app/pages/signin/signin.html`

Append a footer paragraph after the submit button (before closing `</form>`).

**Before** (end of file):
```html
    <button
        pButton
        type="submit"
        label="Đăng nhập"
    ></button>
</form>
```

**After**:
```html
    <button
        pButton
        type="submit"
        label="Đăng nhập"
    ></button>

    <p class="bl_signin_form__footer">
        Chưa có tài khoản?
        <a routerLink="/signup">Đăng ký</a>
    </p>
</form>
```

### Step 4 — Add footer styles to `src/app/pages/signin/signin.scss`

Append inside `.bl_signin_form` block after the `button[pButton]` rule:

```scss
  &__footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: $color-text;

    a {
      color: $accent-color;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
        color: $accent-hover;
      }
    }
  }
```

## Todo List

- [ ] Import `SignupPage` in `app.routes.ts` and add `/signup` route under `AuthLayoutComponent`
- [ ] Add `RouterLink` import to `signin.ts` component imports array
- [ ] Add footer navigation link to `signin.html`
- [ ] Add `&__footer` styles to `signin.scss`

## Success Criteria

- Navigating to `http://localhost:4200/signup` renders the signup form inside the auth layout
- Existing `/signin` route still works
- Clicking "Đăng ký" on the signin page navigates to `/signup`
- Clicking "Đăng nhập" on the signup page navigates to `/signin`
- `ng build` completes without errors

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Auth layout not found / import path wrong | Check `src/app/layouts/auth/auth.ts` exports `AuthLayoutComponent` |
| RouterLink not found in signin template | Confirm `RouterLink` added to `imports` array in `signin.ts` |
| Duplicate `AuthLayoutComponent` route config | Both `/signin` and `/signup` share the component — Angular router handles this correctly as separate route entries |

## Security Considerations

- `/signup` is a public route (no guard) — consistent with `/signin`
- `AuthLayoutComponent` has no guard — correct for auth pages

## Next Steps

- After both phases complete: run `npm start` and manually test the full signup flow
- Verify email verification toast appears on successful registration (handled by existing effect)
- Consider adding redirect from `/signup` to `/` if user is already authenticated (future enhancement)
