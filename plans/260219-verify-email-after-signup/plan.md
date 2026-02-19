---
title: "Verify Email After Signup"
description: "Add email verification flow with token-based URL verification and auto-login on success"
status: completed
priority: P1
effort: 2h
branch: master
tags: [auth, email-verification, ngrx, angular]
created: 2026-02-19
completed: 2026-02-19
---

# Verify Email After Signup

## Overview

Add email verification to the signup flow. After registration, user sees a "check your email" page. Clicking the verification link in their email opens `/verify-email?token=xxx`, which auto-verifies and logs the user in.

## Current Flow
```
Signup → registerSuccess → toast → redirect /signin
```

## Target Flow
```
Signup → registerSuccess → redirect /verify-email-sent (shows email + resend button)
     ↓
User clicks email link → /verify-email?token=xxx
     ↓
Auto POST /api/auth/verify-email → backend returns AuthResponse
     ↓
Auto-login → load user profile → redirect to dashboard
```

## What Already Exists
- Backend endpoints: `POST /api/auth/verify-email`, `POST /api/auth/resend-verification`
- Interceptor whitelists both endpoints (no auth header needed)
- `ResendVerificationRequest` type defined in `types/index.ts`
- Auth layout with left/right panel for public pages

## Implementation Phases

| # | Phase | Files | Status |
|---|-------|-------|--------|
| 1 | [Update NgRx Auth Store](phase-01-update-ngrx-auth-store.md) | 5 files | Complete |
| 2 | [Update Auth Service & Types](phase-02-update-auth-service-and-types.md) | 2 files | Complete |
| 3 | [Create Verify Email Pages & Routes](phase-03-create-verify-email-pages-and-routes.md) | 7 files (2 new components) | Complete |

## Key Dependencies
- Backend must return `AuthResponse` on successful email verification for auto-login
- If backend returns `MessageResponse` instead, fallback: redirect to `/signin` with success toast

## Files Modified
- `src/app/types/index.ts` — add `VerifyEmailRequest`
- `src/app/store/auth/auth.actions.ts` — add verify/resend action triplets
- `src/app/store/auth/auth.state.ts` — add `pendingVerificationEmail`
- `src/app/store/auth/auth.reducer.ts` — handle new actions
- `src/app/store/auth/auth.selectors.ts` — add pending email selector
- `src/app/store/auth/auth.effects.ts` — add verify/resend effects, update registerSuccess$ navigation
- `src/app/services/auth.service.ts` — add verifyEmail/resendVerification methods
- `src/app/app.routes.ts` — add 2 new routes

## Files Created
- `src/app/pages/verify-email-sent/verify-email-sent.ts`
- `src/app/pages/verify-email-sent/verify-email-sent.html`
- `src/app/pages/verify-email-sent/verify-email-sent.scss`
- `src/app/pages/verify-email/verify-email.ts`
- `src/app/pages/verify-email/verify-email.html`
- `src/app/pages/verify-email/verify-email.scss`

## Risk Assessment
- Backend may not return AuthResponse on verify → handled with fallback to /signin
- Token expiry in email link → show meaningful error with resend option
- User navigates to /verify-email-sent without registering → show generic message, link to /signup
