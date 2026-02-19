# Phase 3: Create Verify Email Pages & Routes

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 1](phase-01-update-ngrx-auth-store.md), [Phase 2](phase-02-update-auth-service-and-types.md)
- Routes: [app.routes.ts](../../src/app/app.routes.ts)
- Signup page reference: [signup.ts](../../src/app/pages/signup/signup.ts), [signup.html](../../src/app/pages/signup/signup.html), [signup.scss](../../src/app/pages/signup/signup.scss)
- Auth layout: [auth.html](../../src/app/layouts/auth/auth.html)

## Overview
- **Priority**: P1
- **Status**: Complete
- **Description**: Create two new pages (verify-email-sent, verify-email) and register routes under AuthLayout

## Key Insights
- Both pages render inside AuthLayout (right panel with `<router-outlet>`)
- Follow same BEM patterns as signin/signup pages
- Use PrimeNG components: `p-button`, `p-message`, `p-progressSpinner`
- Vietnamese UI labels matching existing pages
- `verify-email` page reads `?token=xxx` from URL query params via `ActivatedRoute`

## Requirements

### Verify Email Sent Page
- Show "Kiểm tra email của bạn" heading
- Display the registered email from store (`pendingVerificationEmail$`)
- "Gửi lại email xác minh" button with 60s cooldown timer
- Link to go back to `/signin`
- If no pending email in store, show generic message + link to `/signup`

### Verify Email Page
- Read `token` from query params on init
- Auto-POST to verify-email endpoint immediately
- Show loading spinner during verification
- On success: auto-login handled by effect (navigates to dashboard)
- On failure: show error message with "Gửi lại" button and link to `/signin`
- If no token in URL: show error, link to `/signup`

## Architecture

```
/verify-email-sent (AuthLayout)
  └── VerifyEmailSentPage
      ├── reads pendingVerificationEmail$ from store
      ├── resend button dispatches resendVerification(email)
      └── cooldown timer via signal

/verify-email?token=xxx (AuthLayout)
  └── VerifyEmailPage
      ├── reads token from ActivatedRoute.queryParams
      ├── dispatches verifyEmail(token) on init
      ├── subscribes to isLoading$ and error$
      └── success handled by loginSuccess$ effect
```

## Related Code Files

### Created
- `src/app/pages/verify-email-sent/verify-email-sent.ts`
- `src/app/pages/verify-email-sent/verify-email-sent.html`
- `src/app/pages/verify-email-sent/verify-email-sent.scss`
- `src/app/pages/verify-email/verify-email.ts`
- `src/app/pages/verify-email/verify-email.html`
- `src/app/pages/verify-email/verify-email.scss`

### Modified
- `src/app/app.routes.ts`

## Implementation Steps

### 1. Create Verify Email Sent Page

**`verify-email-sent.ts`** (~60 lines):
```typescript
@Component({
  selector: 'verify-email-sent-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, MessageModule, RouterLink],
  templateUrl: './verify-email-sent.html',
  styleUrl: './verify-email-sent.scss',
})
export class VerifyEmailSentPage implements OnInit {
  private authService = inject(AuthService);

  pendingEmail$ = this.authService.pendingVerificationEmail$;
  isLoading$ = this.authService.isLoading$;

  cooldown = signal(0);
  private cooldownInterval: any;

  resendEmail(): void {
    this.pendingEmail$.pipe(take(1)).subscribe(email => {
      if (email) {
        this.authService.resendVerification(email);
        this.startCooldown();
      }
    });
  }

  private startCooldown(): void {
    this.cooldown.set(60);
    this.cooldownInterval = setInterval(() => {
      this.cooldown.update(v => {
        if (v <= 1) {
          clearInterval(this.cooldownInterval);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) clearInterval(this.cooldownInterval);
  }
}
```

**`verify-email-sent.html`** (~50 lines):
- BEM block: `bl_verify_email_sent`
- Mail icon (PrimeNG `pi pi-envelope` or `pi pi-check-circle`)
- Heading: "Kiểm tra email của bạn"
- Paragraph showing the email address
- Resend button with cooldown display
- Footer link to `/signin`

**`verify-email-sent.scss`** (~60 lines):
- Matches signin/signup card style: white card, max-width 420px, border-radius 16px, padding 40px
- Centered icon, heading, and content

### 2. Create Verify Email Page

**`verify-email.ts`** (~50 lines):
```typescript
@Component({
  selector: 'verify-email-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, MessageModule, RouterLink, ProgressSpinnerModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmailPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;
  token: string | null = null;

  ngOnInit(): void {
    this.authService.clearError();
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.authService.verifyEmail(this.token);
    }
  }
}
```

**`verify-email.html`** (~40 lines):
- BEM block: `bl_verify_email`
- If no token: show error "Link không hợp lệ" + link to `/signup`
- If loading: show `<p-progressSpinner>` + "Đang xác minh email..."
- If error: show `<p-message severity="error">` + "Thử lại" button (retry with same token) + link to `/signin`
- Success state not needed in template — effect navigates away automatically

**`verify-email.scss`** (~50 lines):
- Same card style as other auth pages
- Centered spinner and messages

### 3. Update Routes

In `src/app/app.routes.ts`, add under AuthLayout children pattern:

```typescript
{
  path: 'verify-email-sent',
  component: AuthLayoutComponent,
  children: [
    {
      path: '',
      loadComponent: () => import('./pages/verify-email-sent/verify-email-sent')
        .then(m => m.VerifyEmailSentPage)
    }
  ]
},
{
  path: 'verify-email',
  component: AuthLayoutComponent,
  children: [
    {
      path: '',
      loadComponent: () => import('./pages/verify-email/verify-email')
        .then(m => m.VerifyEmailPage)
    }
  ]
},
```

**Note**: Use lazy loading (`loadComponent`) for both new pages to keep bundle size optimal.

## Todo List
- [x] Create verify-email-sent component (ts, html, scss)
- [x] Create verify-email component (ts, html, scss)
- [x] Update app.routes.ts with 2 new routes
- [x] Run `ng build` to verify no compile errors
- [x] Test full flow manually: signup → check-email page → verify link → auto-login

## Success Criteria
- `/verify-email-sent` shows email address and resend button with cooldown
- `/verify-email?token=xxx` auto-sends verification request on load
- Loading spinner shown during verification
- Error state shows meaningful message with retry option
- Successful verification auto-logs in and redirects to dashboard
- Both pages match existing auth page styling

## Risk Assessment
- `pendingVerificationEmail` may be null if user navigates directly to `/verify-email-sent` without registering → handled with fallback UI
- Token may be expired → backend returns error, shown in UI with resend option
- `setInterval` for cooldown needs cleanup on destroy → handled in `ngOnDestroy`

## Security Considerations
- Token from URL is never stored in persistent state
- `clearError()` called on init to prevent stale error display
- Resend button has cooldown to prevent abuse

## Next Steps
- Run `ng build` to verify compilation
- Manual E2E testing of full flow
- Update docs if needed
