# Research: Current Auth UI Implementation

## Auth Layout (`src/app/layouts/auth/`)
- 50/50 flex split layout
- Left: background image from Quizlet CDN, tagline "Học hiệu quả mà thật thoải mái.", app name "QuizHk2t"
- Right: flex centered `<router-outlet>`
- No responsive breakpoints — no mobile handling
- No custom branding — uses external Quizlet image

## Signin Page (`src/app/pages/signin/`)
- Standalone component with inject() DI
- ReactiveFormsModule with FormBuilder
- PrimeNG: InputTextModule, PasswordModule, ButtonModule, MessageModule
- Fields: email (required, email), password (required)
- Dirty-based error display with `@if` control flow
- No title/heading in form
- No signup/forgot-password links
- No loading/error state display from store

## SCSS Variables Available
- `$accent-color: #22c55e` — green (user's chosen primary action color)
- `$accent-hover: #16a34a` — darker green
- `$bg-primary: #0f172a` — dark navy
- `$bg-secondary: #1e293b` — dark slate
- `$bg-card: #1e3a5f` — dark blue
- `$main-color: $bg-card` — alias (dark blue)
- `$color-text: #666` — form labels
- `$color-border-infor: #c1c1c1` — input borders
- `$radius-card: 12px`, `$radius-button: 8px`
- `$font-family: 'Inter', 'Noto Sans', sans-serif`

## SCSS Mixins Available
- `flex-center`, `flex-column`, `flex-column-center`
- `msg-input-error`, `border-error-msg`
- `grid-columns-repeat`, `card-base`, `gradient-card`

## AuthService — Ready
- `register(data: RegisterRequest)` dispatches `registerRequest` action
- `login(credentials)` dispatches `loginRequest` action
- `clearError()` dispatches `clearError`
- Exposes: `isLoading$`, `error$`, `isAuthenticated$`

## NgRx Register Flow — Complete
- Actions: registerRequest/Success/Failure exist
- Effect: POST `/api/auth/register`, toast "Đang đăng ký...", on success redirect to /signin after 2s
- Reducer: handles isLoading + error states
- Selectors: selectIsLoading, selectError, selectLoginState

## Current Problems
1. No title/heading on signin form
2. No navigation links (signup, forgot password)
3. No loading/error state from store displayed
4. Left panel uses external Quizlet image — not self-contained
5. No responsive/mobile design
6. Button uses $main-color (dark blue) instead of $accent-color (green)
7. Form styling is functional but lacks polish (no title, subtitle, proper spacing)
