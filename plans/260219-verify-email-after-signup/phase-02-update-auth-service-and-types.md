# Phase 2: Update Auth Service & Types

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 1](phase-01-update-ngrx-auth-store.md)
- Auth service: [auth.service.ts](../../src/app/services/auth.service.ts)
- Types: [types/index.ts](../../src/app/types/index.ts)

## Overview
- **Priority**: P1
- **Status**: Complete
- **Description**: Add `VerifyEmailRequest` type and expose verifyEmail/resendVerification methods on AuthService facade

## Key Insights
- AuthService is a facade — dispatches actions, exposes selectors as observables
- `ResendVerificationRequest` already exists in types/index.ts
- No `VerifyEmailRequest` type exists yet

## Requirements
- Add `VerifyEmailRequest` interface to types
- Add `verifyEmail()` and `resendVerification()` dispatch methods to AuthService
- Add `pendingVerificationEmail$` observable selector

## Related Code Files

### Modified
- `src/app/types/index.ts`
- `src/app/services/auth.service.ts`

## Implementation Steps

### 1. Update `src/app/types/index.ts`
Add after `ResendVerificationRequest`:
```typescript
export interface VerifyEmailRequest {
  token: string;
}
```

### 2. Update `src/app/services/auth.service.ts`

Add observable:
```typescript
pendingVerificationEmail$ = this.store.select(selectPendingVerificationEmail);
```

Add dispatch methods:
```typescript
verifyEmail(token: string): void {
  this.store.dispatch(AuthActions.verifyEmailRequest({ token }));
}

resendVerification(email: string): void {
  this.store.dispatch(AuthActions.resendVerificationRequest({ email }));
}
```

Add import for `selectPendingVerificationEmail` from selectors.

## Todo List
- [x] Add VerifyEmailRequest interface to types/index.ts
- [x] Add pendingVerificationEmail$ to AuthService
- [x] Add verifyEmail() method to AuthService
- [x] Add resendVerification() method to AuthService
- [x] Run `ng build` to verify no compile errors

## Success Criteria
- `VerifyEmailRequest` type is exported and usable
- AuthService exposes `pendingVerificationEmail$`, `verifyEmail()`, `resendVerification()`
- No compile errors

## Risk Assessment
- Minimal — straightforward additions following existing patterns

## Security Considerations
- No sensitive data exposed — token is only passed through dispatch

## Next Steps
→ Phase 3: Create verify email pages and routes
