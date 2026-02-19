# Research: Project Config & Auth Patterns

## PrimeNG Setup
- Aura preset from `@primeuix/themes`
- Dark mode: disabled
- Ripple: enabled
- MessageService provided globally

## RegisterRequest Type
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}
```

## Register Effect Behavior
- Shows loading: "Đang đăng ký..."
- POST `${API}/auth/register` with {email, password, displayName}
- Success: toast "Đăng ký thành công", navigate to /signin after 2s
- Failure: toast "Đăng ký thất bại" + backend error

## Available Selectors
- `selectIsLoading` — for button loading state
- `selectError` — for error message display
- `selectLoginState` — combined {isLoading, error}

## Fonts Loaded (index.html)
- Inter: 400, 500, 600, 700
- Noto Sans: 400, 500, 600, 700
- PrimeIcons CSS loaded

## Global Styles (styles.scss)
- Reset: margin/padding 0, box-sizing border-box
- html/body: height 100%
- Body: font-family from vars, bg $bg-primary, color $text-primary

## Current Routes
- `/signin` → AuthLayoutComponent > SigninPage (eager)
- `/` → MainLayoutComponent > protected routes (AuthGuard)
- No `/signup` route exists

## Key Design Decisions for Redesign
1. Use $accent-color (#22c55e) for all primary action buttons/links
2. Inter font already loaded — use weight hierarchy: 400 body, 500 labels, 600 buttons, 700 titles
3. Auth layout left panel needs self-contained branding (no external images)
4. Form card should have proper max-width (420-440px), generous padding (32-40px)
5. Add error$ and isLoading$ from AuthService to both signin/signup forms
6. Mobile: hide left panel below 768px, full-width form
