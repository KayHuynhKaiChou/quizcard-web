---
plan: signup-page-implementation
date: 2026-02-19
status: pending
priority: high
---

# Signup Page Implementation

## Overview

Add a signup page to the QuizCard Angular app. The NgRx store (registerRequest/Success/Failure actions, effects, reducer, selectors) and `AuthService.register()` are already complete. This plan covers only the missing UI layer and routing.

## Phases

| # | Phase | Status | Owner Files |
|---|-------|--------|-------------|
| 01 | [Create signup component](./phase-01-create-signup-component.md) | pending | `src/app/pages/signup/signup.ts`, `.html`, `.scss` |
| 02 | [Route and navigation](./phase-02-route-and-navigation.md) | pending | `src/app/app.routes.ts`, `src/app/pages/signin/signin.html` |

## Key Dependencies

- Phase 02 depends on Phase 01 (imports SignupPage component into routes)
- NgRx register actions/effects already wired — no store changes needed
- Auth layout already handles two-column display — no layout changes needed

## Success Definition

- User can navigate to `/signup`, fill email + display name + password + confirm password, submit
- On success: toast shown, redirected (handled by existing effect)
- On error: toast shown (handled by existing effect)
- "Đăng ký" link visible on signin page; "Đăng nhập" link visible on signup page
