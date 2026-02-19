# Phase 03 — Create Signup Page + Add Route

## Overview
- **Priority**: High
- **Status**: pending
- **Depends on**: Phase 01 (auth layout), Phase 02 (design reference)
- **Files owned**:
  - `src/app/pages/signup/signup.ts` (new)
  - `src/app/pages/signup/signup.html` (new)
  - `src/app/pages/signup/signup.scss` (new)
  - `src/app/app.routes.ts` (add signup route)

## Key Insights
- Reuse `.bl_input_group` pattern from signin SCSS — copy shared styles into signup.scss
- Group-level `passwordMatchValidator` — not a `Validators` from Angular, must be a custom `ValidatorFn`
- `RegisterRequest` = `{ email: string, password: string, displayName: string }`
- After success, NgRx effect handles redirect (already implemented in auth.effects.ts)
- Add `clearError()` on form change, same as signin
- BEM prefix: `bl_signup`

## Requirements
- Same card design as signin: max-width 420px, padding 40px, border-radius 16px, shadow
- Title "Đăng ký" — 28px, weight 700, #1a1a1a
- Subtitle "Tạo tài khoản mới" — 14px, #666
- Fields in order:
  1. Email (required, email format)
  2. Tên hiển thị / displayName (required, minLength 2)
  3. Mật khẩu / password (required, minLength 6) — use `p-password` with `[feedback]="false" [toggleMask]="true"`
  4. Xác nhận mật khẩu / confirmPassword (required) — plain `p-password` same config
- Group-level validator: passwords must match; show error on `confirmPassword` field when form group has `passwordMismatch` error
- Loading state: disable button, change label
- API error: show `error$` above submit button
- Footer: "Đã có tài khoản? Đăng nhập" → routerLink="/signin"
- Vietnamese labels throughout

## Architecture — Password Match Validator

```typescript
// Defined outside component class (pure function, no DI needed)
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}
```

Applied at group level: `this.formBuilder.group({ ... }, { validators: passwordMatchValidator })`

Show error when: `form.get('confirmPassword')?.dirty && form.hasError('passwordMismatch')`

## Implementation Steps

### Step 1 — Create `signup.ts`

Create `src/app/pages/signup/signup.ts`:

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'signup-page',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupPage implements OnInit, OnDestroy {
  form!: FormGroup;

  private formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;

  private valueSub?: Subscription;

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        displayName: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );

    this.valueSub = this.form.valueChanges.subscribe(() => {
      this.authService.clearError();
    });
  }

  ngOnDestroy(): void {
    this.valueSub?.unsubscribe();
  }

  signup(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }
    const { email, displayName, password } = this.form.value;
    this.authService.register({ email, displayName, password });
  }
}
```

### Step 2 — Create `signup.html`

Create `src/app/pages/signup/signup.html`:

```html
<div class="bl_signup">
    <div class="bl_signup__header">
        <h1 class="bl_signup__title">Đăng ký</h1>
        <p class="bl_signup__subtitle">Tạo tài khoản mới</p>
    </div>

    <form class="bl_signup__form" [formGroup]="form" (ngSubmit)="signup()">
        <!-- API error -->
        @if (error$ | async; as apiError) {
            <p-message
                class="bl_signup__api-error"
                severity="error"
                size="small"
                variant="simple"
            >{{ apiError }}</p-message>
        }

        <!-- Email -->
        <div class="bl_input_group">
            <label class="bl_input_group__label" for="signup-email">Email</label>
            <input
                id="signup-email"
                type="email"
                formControlName="email"
                placeholder="Nhập địa chỉ email"
                pInputText
                class="bl_input_group__input"
                [invalid]="form.get('email')?.dirty && form.get('email')?.invalid"
            />
            @if (form.get('email')?.dirty && form.get('email')?.hasError('required')) {
                <p-message severity="error" size="small" variant="simple">Email là bắt buộc.</p-message>
            }
            @if (form.get('email')?.dirty && form.get('email')?.hasError('email')) {
                <p-message severity="error" size="small" variant="simple">Email không hợp lệ.</p-message>
            }
        </div>

        <!-- Display Name -->
        <div class="bl_input_group">
            <label class="bl_input_group__label" for="signup-displayName">Tên hiển thị</label>
            <input
                id="signup-displayName"
                type="text"
                formControlName="displayName"
                placeholder="Nhập tên hiển thị"
                pInputText
                class="bl_input_group__input"
                [invalid]="form.get('displayName')?.dirty && form.get('displayName')?.invalid"
            />
            @if (form.get('displayName')?.dirty && form.get('displayName')?.hasError('required')) {
                <p-message severity="error" size="small" variant="simple">Tên hiển thị là bắt buộc.</p-message>
            }
            @if (form.get('displayName')?.dirty && form.get('displayName')?.hasError('minlength')) {
                <p-message severity="error" size="small" variant="simple">Tên hiển thị phải có ít nhất 2 ký tự.</p-message>
            }
        </div>

        <!-- Password -->
        <div class="bl_input_group">
            <label class="bl_input_group__label" for="signup-password">Mật khẩu</label>
            <p-password
                inputId="signup-password"
                formControlName="password"
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                [feedback]="false"
                [toggleMask]="true"
                [invalid]="form.get('password')?.dirty && form.get('password')?.invalid"
            />
            @if (form.get('password')?.dirty && form.get('password')?.hasError('required')) {
                <p-message severity="error" size="small" variant="simple">Mật khẩu là bắt buộc.</p-message>
            }
            @if (form.get('password')?.dirty && form.get('password')?.hasError('minlength')) {
                <p-message severity="error" size="small" variant="simple">Mật khẩu phải có ít nhất 6 ký tự.</p-message>
            }
        </div>

        <!-- Confirm Password -->
        <div class="bl_input_group">
            <label class="bl_input_group__label" for="signup-confirmPassword">Xác nhận mật khẩu</label>
            <p-password
                inputId="signup-confirmPassword"
                formControlName="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                [feedback]="false"
                [toggleMask]="true"
                [invalid]="form.get('confirmPassword')?.dirty && (form.get('confirmPassword')?.invalid || form.hasError('passwordMismatch'))"
            />
            @if (form.get('confirmPassword')?.dirty && form.get('confirmPassword')?.hasError('required')) {
                <p-message severity="error" size="small" variant="simple">Vui lòng xác nhận mật khẩu.</p-message>
            }
            @if (form.get('confirmPassword')?.dirty && form.hasError('passwordMismatch')) {
                <p-message severity="error" size="small" variant="simple">Mật khẩu xác nhận không khớp.</p-message>
            }
        </div>

        <!-- Submit -->
        <button
            pButton
            type="submit"
            class="bl_signup__btn"
            [disabled]="isLoading$ | async"
            [label]="(isLoading$ | async) ? 'Đang đăng ký...' : 'Đăng ký'"
        ></button>
    </form>

    <!-- Footer link -->
    <p class="bl_signup__footer">
        Đã có tài khoản?
        <a class="bl_signup__footer-link" routerLink="/signin">Đăng nhập</a>
    </p>
</div>
```

### Step 3 — Create `signup.scss`

Create `src/app/pages/signup/signup.scss`:

```scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.bl_signup {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);

  // ── Header ──────────────────────────────────────────────────────────────
  &__header {
    margin-bottom: 28px;
    text-align: center;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px;
    font-family: $font-family;
  }

  &__subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  // ── Form ────────────────────────────────────────────────────────────────
  &__form {
    @include flex-column;
    gap: 18px;
  }

  &__api-error {
    display: block;
    margin-bottom: 4px;
  }

  // ── Submit button ────────────────────────────────────────────────────────
  &__btn {
    width: 100% !important;
    height: 48px !important;
    background-color: $accent-color !important;
    border: none !important;
    border-radius: 10px !important;
    color: #fff !important;
    font-weight: 600 !important;
    font-size: 15px !important;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    margin-top: 4px;

    &:hover:not(:disabled) {
      background-color: $accent-hover !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  // ── Footer link ─────────────────────────────────────────────────────────
  &__footer {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #666;
  }

  &__footer-link {
    color: $accent-color;
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;
    transition: color 0.2s ease;

    &:hover {
      color: $accent-hover;
      text-decoration: underline;
    }
  }
}

// ── .bl_input_group styles are in auth.scss (cascades from layout) ──────
// <!-- Updated: Validation Session 1 - Moved to auth layout SCSS -->
```

### Step 4 — Update `app.routes.ts`

Diff to apply to `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { SigninPage } from './pages/signin/signin';
import { SignupPage } from './pages/signup/signup';       // ADD
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
    path: 'signup',                                        // ADD
    component: AuthLayoutComponent,                       // ADD
    children: [                                           // ADD
      { path: '', component: SignupPage },                // ADD
    ],                                                    // ADD
  },                                                      // ADD
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardPage, pathMatch: 'full' },
      { path: 'library', component: LibraryComponent },
      {
        path: 'set/:id',
        loadComponent: () => import('./pages/studyset-detail/studyset-detail').then(m => m.StudySetDetailPage)
      },
      {
        path: 'quiz/:id',
        loadComponent: () => import('./pages/quiz/quiz').then(m => m.QuizPage)
      },
      { path: 'notifications', component: NotificationsComponent },
    ],
    canActivate: [AuthGuard],
  },
];
```

## Todo

- [ ] Create directory `src/app/pages/signup/`
- [ ] Create `src/app/pages/signup/signup.ts` with `SignupPage` component + `passwordMatchValidator`
- [ ] Create `src/app/pages/signup/signup.html` with all 4 fields + validation messages + footer link
- [ ] Create `src/app/pages/signup/signup.scss` with card + button + input group styles
- [ ] Update `src/app/app.routes.ts` — add `SignupPage` import + `/signup` route under `AuthLayoutComponent`
- [ ] Verify `passwordMatchValidator` fires correctly when passwords differ
- [ ] Verify form marks all fields dirty on invalid submit attempt
- [ ] Verify loading state disables button
- [ ] Verify API error clears on form value change
- [ ] Verify routerLink="/signin" works on footer

## Success Criteria
- `/signup` route renders inside auth layout (2-column shell from Phase 1)
- All 4 fields render with correct validation
- Password mismatch shows error on confirmPassword field (group-level error)
- Button uses green accent, 48px height, disabled + label changes when loading
- "Đã có tài khoản? Đăng nhập" footer navigates to /signin
- `authService.register()` called with `{ email, displayName, password }`
- No TypeScript compile errors

## Risk Assessment
- Group-level validator runs after each field-level validator — both must pass for form to be valid; ensure `submit` calls markAsDirty on all controls including `confirmPassword`
- `p-password` `inputId` attribute required for `for` attribute on `<label>` to work correctly
- `app.routes.ts` change is minimal — adding 6 lines, existing routes unaffected

## Security Considerations
- `confirmPassword` field is NOT sent to server — only `email`, `displayName`, `password` from `form.value`
- Client-side password match validation only; server enforces its own rules
- No tokens or credentials stored in component state
