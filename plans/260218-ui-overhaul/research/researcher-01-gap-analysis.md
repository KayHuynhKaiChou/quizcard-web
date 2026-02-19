# Gap Analysis: Current Codebase vs PRD Requirements (UI-only)

## Priority Matrix

| Feature | Priority | Complexity | Status |
|---------|----------|------------|--------|
| **Auth: Register page** | P0 | M | New |
| **Auth: Verify Email page** | P0 | S | New |
| **Auth: Forgot Password page** | P0 | S | New |
| **Auth: Reset Password page** | P0 | S | New |
| **Auth: Login page update** (email field, forgot link) | P0 | S | Modify |
| **Study Set CRUD: Create page** | P0 | L | New |
| **Study Set CRUD: Edit page** | P0 | L | New |
| **Home Page redesign** (sections, stats) | P0 | L | Modify |
| **Library: search/filter toolbar** | P1 | M | Modify |
| **Library: grid/list toggle, badges** | P1 | S | Modify |
| **Flashcard: progress bar + shuffle** | P1 | M | Modify |
| **Flashcard: mark learned, flip order** | P1 | M | Modify |
| **Flashcard: gradient card design** | P1 | S | Modify |
| **AI Generate page** | P1 | XL | New |
| **Quiz: True/False type** | P1 | M | Modify |
| **Quiz: Fill-in-blank type** | P1 | M | Modify |
| **Quiz: Matching type** | P1 | L | Modify |
| **Quiz: config screen (mix types)** | P1 | M | Modify |
| **Profile page** | P1 | M | New |
| **Design system update** (colors, fonts) | P1 | M | Modify |
| **Sidebar: add Explore + AI links** | P1 | S | Modify |
| **Import CSV** | P2 | M | New |
| **Explore page** (trending, search) | P2 | L | New |
| **TTS (Web Speech API)** | P2 | S | New |

## New Pages Needed (8)

1. `pages/register/` - Registration form
2. `pages/verify-email/` - Email verification status
3. `pages/forgot-password/` - Forgot password form
4. `pages/reset-password/` - Reset password form
5. `pages/create-studyset/` - Study set creation wizard
6. `pages/edit-studyset/` - Study set editor
7. `pages/ai-generate/` - AI vocabulary generation
8. `pages/profile/` - User profile + settings

## Existing Pages to Modify (6)

1. `pages/signin/` - Change username→email, add forgot password link
2. `pages/dashboard/` - Full redesign with sections & dynamic data
3. `pages/library/` - Add toolbar (search, filter, sort, view mode)
4. `pages/studyset-detail/` - Progress bar, shuffle, mark learned, gradient card
5. `pages/quiz/` - New question types, config screen improvements
6. `pages/notifications/` - Build out from placeholder

## New Shared Components (7)

1. `components/common/ai-usage-badge/` - "Còn X/5 lượt AI hôm nay"
2. `components/common/study-set-form/` - Reusable form for create/edit
3. `components/common/term-editor/` - Term list editor with add/remove/reorder
4. `components/common/search-toolbar/` - Search + filter + sort bar
5. `components/common/stats-card/` - Quick stat display (streak, words, etc.)
6. `components/common/empty-state/` - Reusable empty state with icon + message
7. `components/common/view-toggle/` - Grid/list view toggle buttons

## NgRx Store Changes

### New State Slices
- `store/ai/` - AI usage tracking (remaining quota, generation history)
- `store/ui/` - UI preferences (view mode, theme, sidebar state)

### Existing Modifications
- `store/studyset/` - Add CRUD actions (create, update, delete), search/filter state
- `store/auth/` - Add register, verifyEmail, forgotPassword, resetPassword actions
- `types/index.ts` - Add AiUsage, UserProfile, QuizConfig interfaces

## Design System Changes (_variables.scss)

| Variable | Current | New (PRD) |
|----------|---------|-----------|
| Background | `#1a2e3f` | `#0f172a` |
| Card bg | N/A | `#1e3a5f` |
| Accent | N/A | `#22c55e` |
| Card gradient | N/A | `linear-gradient(135deg, #6366f1, #a855f7, #6366f1)` |
| Text secondary | N/A | `#94a3b8` |
| Border | N/A | `#334155` |
| Border radius cards | N/A | `12px` |
| Border radius buttons | N/A | `8px` |
| Font family | system-fonts | Inter, Noto Sans |

## Route Changes (app.routes.ts)

### New Auth Routes (under AuthLayout)
- `/register` → RegisterPage
- `/verify-email` → VerifyEmailPage
- `/forgot-password` → ForgotPasswordPage
- `/reset-password` → ResetPasswordPage

### New Protected Routes (under MainLayout, guarded)
- `/create-set` → CreateStudySetPage
- `/set/:id/edit` → EditStudySetPage
- `/ai-generate` → AiGeneratePage
- `/profile` → ProfilePage
- `/explore` → ExplorePage (P2)
