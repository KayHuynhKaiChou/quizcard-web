---
id: 260219-0701-auth-ui-redesign
title: Auth UI Redesign — Signin + Signup
created: 2026-02-19
status: complete
priority: high
---

# Auth UI Redesign

Unified polished auth flow: redesign signin, create signup, redesign auth layout shell.
Split-screen 2-column, accent green (#22c55e), Vietnamese labels, mobile-responsive.

## Phases

| # | Phase | Files | Status |
|---|-------|-------|--------|
| 1 | [Redesign Auth Layout](./phase-01-redesign-auth-layout.md) | `layouts/auth/auth.html`, `auth.scss`, `auth.ts` | complete |
| 2 | [Redesign Signin Page](./phase-02-redesign-signin-page.md) | `pages/signin/signin.ts`, `.html`, `.scss` | complete |
| 3 | [Create Signup Page + Route](./phase-03-create-signup-page-and-route.md) | `pages/signup/*`, `app.routes.ts` | complete |

## Key Constraints
- Phase 1 must complete before Phase 2 (layout shell required)
- Phase 2 must complete before Phase 3 (shared design reference)
- No NgModules — standalone components only
- Keep `AuthGuard` and route structure intact
- Remove external Quizlet image dependency

## Dependencies Already Done
- NgRx `registerRequest` action/effect/reducer/selectors
- `AuthService.register()`, `login()`, `isLoading$`, `error$`, `clearError()`
- `RegisterRequest` type: `{ email, password, displayName }`
- HTTP interceptor whitelists `/api/auth/register`

## Validation Log

### Session 1 — 2026-02-19
**Trigger:** Initial plan creation validation
**Questions asked:** 4

#### Questions & Answers

1. **[UI Design]** Left panel dùng CSS-only circles làm decoration. Bạn có muốn thêm illustration/image thật không?
   - Options: CSS circles is fine | Thêm SVG illustration | Dùng gradient pattern phức tạp hơn
   - **Answer:** Dùng gradient pattern phức tạp hơn
   - **Rationale:** CSS-only circles too simple — add dots/grid pattern for more visual interest without external images

2. **[CSS DRY]** Input group styles (.bl_input_group) bị duplicate giữa signin.scss và signup.scss. Nên extract ra shared file không?
   - Options: Duplicate OK cho giờ | Extract ra _auth-form.scss partial | Đưa vào auth layout SCSS
   - **Answer:** Đưa vào auth layout SCSS
   - **Rationale:** Auth layout cascades to children, centralizes form input styles, eliminates duplication

3. **[CSS Override]** Plan dùng nhiều `!important` để override PrimeNG styles. Bạn OK với approach này?
   - Options: OK, !important cho PrimeNG | Dùng ::ng-deep thay !important | Tạo custom PrimeNG theme preset
   - **Answer:** OK, !important cho PrimeNG
   - **Rationale:** PrimeNG Aura has high specificity; !important is common accepted pattern

4. **[Loading UX]** Signin/Signup hiện chưa show loading overlay (LoadingService). Chỉ disable button + đổi label có đủ không?
   - Options: Button disable + label change là đủ | Thêm spinner icon trong button | Dùng cả LoadingService overlay
   - **Answer:** Dùng cả LoadingService overlay
   - **Rationale:** Full-screen loading overlay already exists as component — use it for consistent UX across app

#### Confirmed Decisions
- Left panel decoration: CSS gradient + dots/grid pattern (no external images, no plain circles)
- Input group styles: Centralized in auth.scss (cascade to signin/signup children)
- PrimeNG override: `!important` is acceptable
- Loading UX: Use existing LoadingService overlay (already handled by effects) + button disable

#### Action Items
- [ ] Phase 1: Replace simple circles with gradient + CSS dot/grid pattern on left panel
- [ ] Phase 1: Add shared `.bl_input_group` styles to auth.scss
- [ ] Phase 2: Remove `.bl_input_group` from signin.scss (moved to auth layout)
- [ ] Phase 3: Remove `.bl_input_group` from signup.scss (moved to auth layout)
- [ ] Phase 2 & 3: No extra LoadingService code needed — effects already call LoadingService.show/hide

#### Impact on Phases
- Phase 1: Left panel needs CSS dots/grid pattern instead of just circles. Auth.scss must include shared `.bl_input_group` styles for all child forms
- Phase 2: Remove `.bl_input_group` block from signin.scss — it will cascade from auth layout
- Phase 3: Remove `.bl_input_group` block from signup.scss — same reason
