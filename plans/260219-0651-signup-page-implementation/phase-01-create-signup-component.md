# Phase 01 — Create Signup Component

## Context Links

- Signin component (mirror): `src/app/pages/signin/signin.ts`, `.html`, `.scss`
- Auth actions: `src/app/store/auth/auth.actions.ts` — `registerRequest` action exists
- AuthService: `src/app/services/auth.service.ts` — `register(data: RegisterRequest)` exists
- Types: `src/app/types/index.ts` — `RegisterRequest { email, password, displayName }`
- SCSS variables: `src/app/styles/_variables.scss`

## Overview

- **Priority**: High
- **Status**: Pending
- **Description**: Create three files for the signup page. Mirror the signin component pattern exactly. Add a password confirmation field with client-side cross-field validation only (no extra API call).

## Key Insights

- `confirmPassword` is UI-only — not sent to API. Use a custom `AbstractControl` validator on the `FormGroup` level.
- `AuthService.register()` dispatches `registerRequest` action. Effect handles success toast + navigation. Component only calls the service.
- PrimeNG `p-password` with `[feedback]="false"` and `[toggleMask]="true"` matches signin pattern.
- Dirty-based error display: show errors only after `markAsDirty()` is called (on submit or field touch).
- SCSS block name: `.bl_signup_form` (parallel to `.bl_signin_form`).

## Requirements

### Functional
- Form fields: Email (required, email format), Display Name (required, minlength 2), Password (required, minlength 6), Confirm Password (required, must match Password)
- Submit: mark all dirty if invalid; call `authService.register({ email, password, displayName })` if valid
- Navigation link: `routerLink="/signin"` at bottom of form

### Non-functional
- Standalone component, `inject()` DI, no NgModules
- Zoneless-safe (no manual `ChangeDetectorRef` calls needed for this form)
- File size under 200 lines each

## Architecture

```
SignupPage (standalone)
  FormBuilder → FormGroup (email, displayName, password, confirmPassword)
  Custom validator: passwordMatchValidator (group-level)
  AuthService.register() → dispatches registerRequest action
  Effect (existing) → HTTP POST /api/auth/register → success toast + navigate
```

## Related Code Files

### Files to Create
- `src/app/pages/signup/signup.ts`
- `src/app/pages/signup/signup.html`
- `src/app/pages/signup/signup.scss`

### Files to Read (reference only, do not modify)
- `src/app/pages/signin/signin.ts`
- `src/app/pages/signin/signin.html`
- `src/app/pages/signin/signin.scss`

## Implementation Steps

### Step 1 — Create `src/app/pages/signup/signup.ts`

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/** Cross-field validator: confirmPassword must equal password */
export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'signup-page',
  standalone: true,
  imports: [
    CommonModule,
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
export class SignupPage implements OnInit {
  form!: FormGroup;
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

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
  }

  signup(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }

    const { email, password, displayName } = this.form.value;
    this.authService.register({ email, password, displayName });
  }
}
```

### Step 2 — Create `src/app/pages/signup/signup.html`

```html
<form
    class="bl_signup_form"
    [formGroup]="form"
    (ngSubmit)="signup()"
>
    <h2 class="bl_signup_form__title">Đăng ký</h2>

    <div class="bl_input_group">
        <label>Email</label>
        <input
            type="email"
            formControlName="email"
            placeholder="Nhập email"
            pInputText
            [invalid]="form.get('email')?.dirty && form.get('email')?.invalid"
        />
        @if (form.get('email')?.dirty && form.get('email')?.hasError('required')) {
            <p-message severity="error" size="small" variant="simple">Email is required.</p-message>
        }
        @if (form.get('email')?.dirty && form.get('email')?.hasError('email')) {
            <p-message severity="error" size="small" variant="simple">Invalid email format.</p-message>
        }
    </div>

    <div class="bl_input_group">
        <label>Tên hiển thị</label>
        <input
            type="text"
            formControlName="displayName"
            placeholder="Nhập tên hiển thị"
            pInputText
            [invalid]="form.get('displayName')?.dirty && form.get('displayName')?.invalid"
        />
        @if (form.get('displayName')?.dirty && form.get('displayName')?.hasError('required')) {
            <p-message severity="error" size="small" variant="simple">Tên hiển thị là bắt buộc.</p-message>
        }
        @if (form.get('displayName')?.dirty && form.get('displayName')?.hasError('minlength')) {
            <p-message severity="error" size="small" variant="simple">Tên hiển thị phải có ít nhất 2 ký tự.</p-message>
        }
    </div>

    <div class="bl_input_group">
        <label>Mật khẩu</label>
        <p-password
            formControlName="password"
            placeholder="Nhập mật khẩu"
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

    <div class="bl_input_group">
        <label>Xác nhận mật khẩu</label>
        <p-password
            formControlName="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            [feedback]="false"
            [toggleMask]="true"
            [invalid]="(form.get('confirmPassword')?.dirty && form.get('confirmPassword')?.invalid) || (form.get('confirmPassword')?.dirty && form.hasError('passwordMismatch'))"
        />
        @if (form.get('confirmPassword')?.dirty && form.get('confirmPassword')?.hasError('required')) {
            <p-message severity="error" size="small" variant="simple">Xác nhận mật khẩu là bắt buộc.</p-message>
        }
        @if (form.get('confirmPassword')?.dirty && form.hasError('passwordMismatch')) {
            <p-message severity="error" size="small" variant="simple">Mật khẩu không khớp.</p-message>
        }
    </div>

    <button
        pButton
        type="submit"
        label="Đăng ký"
    ></button>

    <p class="bl_signup_form__footer">
        Đã có tài khoản?
        <a routerLink="/signin">Đăng nhập</a>
    </p>
</form>
```

### Step 3 — Create `src/app/pages/signup/signup.scss`

```scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.bl_signup_form {
  min-width: 400px;
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 0 auto;

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $color-text;
    margin-bottom: 24px;
    text-align: center;
  }

  .bl_input_group {
    margin-bottom: 24px;

    label {
      display: block;
      font-weight: 500;
      color: $color-text;
      margin-bottom: 8px;
    }

    input[type='text'],
    input[type='email'],
    ::ng-deep .p-password input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid $color-border-infor;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s ease;
      background-color: #fafafa;
      color: #333;

      &::placeholder {
        color: #999;
      }

      &:focus {
        outline: none;
        border-color: $accent-color;
        background-color: white;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
      }

      &:hover:not(:focus) {
        border-color: darken($color-border-infor, 10%);
      }
    }

    ::ng-deep .p-password {
      width: 100%;

      .p-inputtext {
        width: 100%;
      }

      .p-password-toggle {
        color: $accent-color;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: $accent-hover;
        }
      }

      .p-icon-wrapper {
        right: 12px;
      }
    }

    p-message {
      margin-top: 6px;
      display: block;
    }
  }

  button[pButton] {
    width: 100%;
    padding: 14px;
    background-color: $accent-color;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 8px;

    &:hover {
      background-color: $accent-hover;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

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
}
```

## Todo List

- [ ] Create `src/app/pages/signup/signup.ts` with `SignupPage` component, `passwordMatchValidator`, form init, `signup()` method
- [ ] Create `src/app/pages/signup/signup.html` with four input groups and footer link
- [ ] Create `src/app/pages/signup/signup.scss` mirroring signin styles with `.bl_signup_form` block

## Success Criteria

- Component compiles with `ng build` without errors
- Form shows four fields: email, displayName, password, confirmPassword
- Submitting empty form marks all fields dirty and shows validation errors
- Password mismatch shows group-level error on confirmPassword field
- Valid form calls `authService.register({ email, password, displayName })`
- "Đăng nhập" link is present and navigates to `/signin`

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| `passwordMismatch` error on group not shown properly | Check `form.hasError('passwordMismatch')` (not `form.get('confirmPassword')?.hasError(...)`) |
| PrimeNG `p-password` width not 100% | Mirror existing `::ng-deep .p-password` CSS from signin |
| `RouterLink` not imported | Add `RouterLink` to `imports` array in component decorator |

## Security Considerations

- Password never logged or stored in component state beyond form lifecycle
- `confirmPassword` field value never sent to API (destructure only `email, password, displayName`)
- Client-side validation is supplementary — backend validates all fields independently

## Next Steps

- Phase 02 imports `SignupPage` into `app.routes.ts`
- Phase 02 adds navigation link in `signin.html`
