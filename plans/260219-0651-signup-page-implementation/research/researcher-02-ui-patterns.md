# Research Report: UI Patterns & Component Library

## PrimeNG Components Used in Auth Forms

| Component | Module | Usage |
|-----------|--------|-------|
| `pInputText` | InputTextModule | Email field |
| `p-password` | PasswordModule | Password with toggle mask |
| `p-message` | MessageModule | Inline validation errors |
| `pButton` | ButtonModule | Submit button |

## Form Pattern (from signin.ts)
- ReactiveFormsModule with FormBuilder
- Validators: `Validators.required`, `Validators.email`
- On invalid submit: marks all controls dirty
- Error display: `@if (control?.dirty && control?.hasError('x'))` pattern

## SCSS Variables Available
- `$main-color: #1e3a5f` - Primary brand color
- `$color-text: #666` - Default text
- `$color-border-infor: #c1c1c1` - Borders
- `$radius-card: 12px`, `$radius-button: 8px`
- `$font-family: 'Inter', 'Noto Sans', ...`

## SCSS Mixins Available
- `@mixin flex-center` - Centered flex
- `@mixin flex-column` - Column flex
- `@mixin flex-column-center` - Column centered
- `@mixin msg-input-error` - Error message styling
- `@mixin border-error-msg` - Error border

## Signin Form Styling Pattern
- `.bl_signin_form` - min-width 400px, white bg, shadow, rounded
- `.bl_input_group` - margin-bottom 24px, label + input + error
- Input: 12px padding, #fafaba bg, border transition
- Button: full-width, $main-color bg, hover translateY(-2px)
- `::ng-deep .p-password` for PrimeNG password internals

## Component Structure (Standalone)
- `inject()` for DI
- `OnInit` for form setup
- imports array: CommonModule, ButtonModule, InputTextModule, PasswordModule, MessageModule, ReactiveFormsModule
- File naming: `signup.ts`, `signup.html`, `signup.scss`

## Unresolved Questions
- Should signup form include password strength indicator? (PrimeNG p-password has `[feedback]` prop)
- Vietnamese or English for form labels? (Signin uses Vietnamese: "Email", "Mật khẩu")
