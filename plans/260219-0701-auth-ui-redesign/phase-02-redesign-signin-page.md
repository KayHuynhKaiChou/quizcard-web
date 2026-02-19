# Phase 02 — Redesign Signin Page

## Overview
- **Priority**: High
- **Status**: pending
- **Depends on**: Phase 01 (auth layout shell)
- **Files owned**:
  - `src/app/pages/signin/signin.ts`
  - `src/app/pages/signin/signin.html`
  - `src/app/pages/signin/signin.scss`

## Key Insights
- Add `isLoading$` and `error$` from `AuthService` — disable button and show API error
- Add `RouterLink` to navigate to `/signup`
- `clearError()` on form value change to prevent stale error messages
- Keep existing `signin()` method logic intact
- BEM prefix: `bl_signin`
- `p-password` PrimeNG component needs `::ng-deep` for inner input width fix

## Requirements
- Form card: white bg, max-width 420px, padding 40px, border-radius 16px, shadow
- Title "Đăng nhập" — 28px, weight 700, #1a1a1a
- Subtitle "Chào mừng bạn trở lại" — 14px, #666
- Inputs: height 44px, border-radius 10px, border #d1d5db
- Input focus: border $accent-color, box-shadow 0 0 0 3px rgba(34,197,94,0.15)
- Submit button: bg $accent-color, hover $accent-hover, height 48px, border-radius 10px, weight 600
- Footer: "Chưa có tài khoản?" + RouterLink to /signup
- Loading: disable button + show spinner label via `isLoading$`
- API error: show `error$` above submit button via `p-message severity="error"`
- Clear stale error on any form field change

## Implementation Steps

### Step 1 — Rewrite `signin.ts`

Replace contents of `src/app/pages/signin/signin.ts`:

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'signin-page',
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
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class SigninPage implements OnInit, OnDestroy {
  form!: FormGroup;

  private formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;

  private valueSub?: Subscription;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Clear stale API error whenever user edits the form
    this.valueSub = this.form.valueChanges.subscribe(() => {
      this.authService.clearError();
    });
  }

  ngOnDestroy(): void {
    this.valueSub?.unsubscribe();
  }

  signin(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }
    const { email, password } = this.form.value;
    this.authService.login({ email, password });
  }
}
```

### Step 2 — Rewrite `signin.html`

Replace contents of `src/app/pages/signin/signin.html`:

```html
<div class="bl_signin">
    <div class="bl_signin__header">
        <h1 class="bl_signin__title">Đăng nhập</h1>
        <p class="bl_signin__subtitle">Chào mừng bạn trở lại</p>
    </div>

    <form class="bl_signin__form" [formGroup]="form" (ngSubmit)="signin()">
        <!-- API error -->
        @if (error$ | async; as apiError) {
            <p-message
                class="bl_signin__api-error"
                severity="error"
                size="small"
                variant="simple"
            >{{ apiError }}</p-message>
        }

        <!-- Email -->
        <div class="bl_input_group">
            <label class="bl_input_group__label" for="signin-email">Email</label>
            <input
                id="signin-email"
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

        <!-- Password -->
        <div class="bl_input_group">
            <label class="bl_input_group__label" for="signin-password">Mật khẩu</label>
            <p-password
                inputId="signin-password"
                formControlName="password"
                placeholder="Nhập mật khẩu"
                [feedback]="false"
                [toggleMask]="true"
                [invalid]="form.get('password')?.dirty && form.get('password')?.invalid"
            />
            @if (form.get('password')?.dirty && form.get('password')?.hasError('required')) {
                <p-message severity="error" size="small" variant="simple">Mật khẩu là bắt buộc.</p-message>
            }
        </div>

        <!-- Submit -->
        <button
            pButton
            type="submit"
            class="bl_signin__btn"
            [disabled]="isLoading$ | async"
            [label]="(isLoading$ | async) ? 'Đang đăng nhập...' : 'Đăng nhập'"
        ></button>
    </form>

    <!-- Footer link -->
    <p class="bl_signin__footer">
        Chưa có tài khoản?
        <a class="bl_signin__footer-link" routerLink="/signup">Đăng ký</a>
    </p>
</div>
```

### Step 3 — Rewrite `signin.scss`

Replace contents of `src/app/pages/signin/signin.scss`:

```scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.bl_signin {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);

  // ── Header ──────────────────────────────────────────────────────────────
  &__header {
    margin-bottom: 32px;
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
    gap: 20px;
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
    margin-top: 24px;
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

## Todo

- [ ] Rewrite `src/app/pages/signin/signin.ts` — add `isLoading$`, `error$`, `RouterLink`, `valueSub` cleanup
- [ ] Rewrite `src/app/pages/signin/signin.html` — title, subtitle, API error, loading button, footer link
- [ ] Rewrite `src/app/pages/signin/signin.scss` — new card styles, accent green button, input group shared styles
- [ ] Verify form validation messages still appear correctly
- [ ] Verify loading state disables button
- [ ] Verify `routerLink="/signup"` navigates correctly (route added in Phase 3)
- [ ] Verify API error clears on form edit

## Success Criteria
- Card renders at max-width 420px centered in right panel
- Title + subtitle visible
- Inputs at 44px height, 10px radius, green focus ring
- Button green (#22c55e), hover darkens, disabled when loading
- API error shown above button when `error$` emits
- "Chưa có tài khoản? Đăng ký" link navigates to /signup
- No compile errors, no type errors

## Risk Assessment
- `p-password` inner input styling requires `::ng-deep` — Angular ViewEncapsulation limitation, acceptable
- `isLoading$` binding with `async` pipe — ensure `AsyncPipe` is imported in standalone component
