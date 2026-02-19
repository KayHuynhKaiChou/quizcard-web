# Codebase Summary

## Directory Structure

```
src/
├── app/
│   ├── components/
│   │   └── common/                          # Shared, reusable UI components
│   │       ├── ai-usage-badge/
│   │       │   ├── ai-usage-badge.ts        # Display AI feature usage stats
│   │       │   ├── ai-usage-badge.html
│   │       │   └── ai-usage-badge.scss
│   │       ├── empty-state/
│   │       │   ├── empty-state.ts           # Empty state display component
│   │       │   ├── empty-state.html
│   │       │   └── empty-state.scss
│   │       ├── flashcard/
│   │       │   ├── flashcard.ts             # Flashcard with flip, TTS, shuffle, mark-learned
│   │       │   ├── flashcard.html
│   │       │   └── flashcard.scss
│   │       ├── header/
│   │       │   ├── header.component.ts      # Top navigation bar with user menu
│   │       │   ├── header.component.html
│   │       │   └── header.component.scss
│   │       ├── loading-overlay/
│   │       │   ├── loading-overlay.component.ts  # Global loading spinner
│   │       │   ├── loading-overlay.component.html
│   │       │   └── loading-overlay.component.scss
│   │       ├── search-toolbar/
│   │       │   ├── search-toolbar.ts        # Search input with filter/sort options
│   │       │   ├── search-toolbar.html
│   │       │   └── search-toolbar.scss
│   │       ├── sidebar/
│   │       │   ├── sidebar.component.ts     # Left navigation menu
│   │       │   ├── sidebar.component.html
│   │       │   └── sidebar.component.scss
│   │       ├── stats-card/
│   │       │   ├── stats-card.ts            # Display statistics with icon/color
│   │       │   ├── stats-card.html
│   │       │   └── stats-card.scss
│   │       ├── studyset-card/
│   │       │   ├── studyset-card.ts         # Card component for library grid
│   │       │   ├── studyset-card.html
│   │       │   └── studyset-card.scss
│   │       ├── studyset-form/
│   │       │   ├── studyset-form.ts         # Reusable form for create/edit study sets
│   │       │   ├── studyset-form.html
│   │       │   └── studyset-form.scss
│   │       ├── term-editor/
│   │       │   ├── term-editor.ts           # Inline editor for terms with drag-drop
│   │       │   ├── term-editor.html
│   │       │   └── term-editor.scss
│   │       ├── view-toggle/
│   │       │   ├── view-toggle.ts           # Toggle between grid/list view
│   │       │   ├── view-toggle.html
│   │       │   └── view-toggle.scss
│   │       └── progress-bar/
│   │           ├── progress-bar.ts          # Show current position in flashcard sequence
│   │           ├── progress-bar.html
│   │           └── progress-bar.scss
│   ├── fakeData/                            # Static vocabulary datasets
│   │   ├── hiragana.js                      # Japanese hiragana + meanings
│   │   ├── kanji.js                         # Japanese kanji + meanings
│   │   ├── toeic-part-1.js                  # TOEIC Part 1 vocabulary
│   │   ├── toeic-part-2.js                  # TOEIC Part 2 vocabulary
│   │   ├── toeic-part-3.js                  # TOEIC Part 3 vocabulary
│   │   ├── toeic-part-4.js                  # TOEIC Part 4 vocabulary
│   │   ├── toeic-general-1.js               # General TOEIC 1
│   │   ├── toeic-general-2.js               # General TOEIC 2
│   │   └── toeic-general-3.js               # General TOEIC 3
│   ├── guards/
│   │   └── auth.guard.ts                    # Route protection via auth token check
│   ├── interceptors/
│   │   └── auth.interceptor.ts              # HTTP: Adds Bearer token to requests
│   ├── layouts/
│   │   ├── auth/
│   │   │   ├── auth.ts                      # Layout for public routes (signin)
│   │   │   ├── auth.html
│   │   │   ├── auth.scss
│   │   │   └── auth.spec.ts
│   │   └── main/
│   │       ├── main.ts                      # Layout for protected routes (header+sidebar)
│   │       ├── main.html
│   │       ├── main.scss
│   │       └── main.spec.ts
│   ├── pages/
│   │   ├── ai-generate/
│   │   │   ├── ai-generate.ts               # AI term generation page with prompt input
│   │   │   ├── ai-generate.html
│   │   │   ├── ai-generate.scss
│   │   │   └── ai-generate.spec.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.ts                 # Home page with stats cards and quick access
│   │   │   ├── dashboard.html
│   │   │   ├── dashboard.scss
│   │   │   └── dashboard.spec.ts
│   │   ├── library/
│   │   │   ├── library.ts                   # Browse study sets with search, view toggle, skeletons
│   │   │   ├── library.html
│   │   │   ├── library.scss
│   │   │   └── library.spec.ts
│   │   ├── notifications/
│   │   │   ├── notifications.ts             # User notifications page
│   │   │   ├── notifications.html
│   │   │   └── notifications.scss
│   │   ├── profile/
│   │   │   ├── profile.ts                   # User profile with edit and password change
│   │   │   ├── profile.html
│   │   │   ├── profile.scss
│   │   │   └── profile.spec.ts
│   │   ├── quiz/
│   │   │   ├── quiz.ts                      # Quiz: MC, T/F, Fill-blank, timer, results
│   │   │   ├── quiz.html
│   │   │   ├── quiz.scss
│   │   │   └── quiz.spec.ts
│   │   ├── signin/
│   │   │   ├── signin.ts                    # Sign-in form, dispatches loginRequest
│   │   │   ├── signin.html
│   │   │   ├── signin.scss
│   │   │   └── signin.spec.ts
│   │   ├── signup/
│   │   │   ├── signup.ts                    # Sign-up form, dispatches registerRequest
│   │   │   ├── signup.html
│   │   │   ├── signup.scss
│   │   │   └── signup.spec.ts
│   │   ├── create-set/
│   │   │   ├── create-set.ts                # Create study set with form and term editor
│   │   │   ├── create-set.html
│   │   │   ├── create-set.scss
│   │   │   └── create-set.spec.ts
│   │   ├── forgot-password/
│   │   │   ├── forgot-password.ts           # Request password reset email
│   │   │   ├── forgot-password.html
│   │   │   ├── forgot-password.scss
│   │   │   └── forgot-password.spec.ts
│   │   ├── reset-password/
│   │   │   ├── reset-password.ts            # Reset password with token from email
│   │   │   ├── reset-password.html
│   │   │   ├── reset-password.scss
│   │   │   └── reset-password.spec.ts
│   │   ├── verify-email-sent/
│   │   │   ├── verify-email-sent.ts         # Verification pending page with resend option
│   │   │   ├── verify-email-sent.html
│   │   │   ├── verify-email-sent.scss
│   │   │   └── verify-email-sent.spec.ts
│   │   ├── verify-email/
│   │   │   ├── verify-email.ts              # Token verification page, auto-verifies from URL
│   │   │   ├── verify-email.html
│   │   │   ├── verify-email.scss
│   │   │   └── verify-email.spec.ts
│   │   ├── set/:id/edit/
│   │   │   ├── studyset-edit.ts             # Edit study set with form and term editor
│   │   │   ├── studyset-edit.html
│   │   │   ├── studyset-edit.scss
│   │   │   └── studyset-edit.spec.ts
│   │   └── studyset-detail/
│   │       ├── studyset-detail.ts           # Flashcard viewer, progress bar, TTS, shuffle
│   │       ├── studyset-detail.html
│   │       ├── studyset-detail.scss
│   │       └── studyset-detail.spec.ts
│   ├── services/
│   │   ├── auth.service.ts                  # Auth facade: exposes observables + sync getters
│   │   ├── loading.service.ts               # Global loading state (BehaviorSubject)
│   │   ├── sidebar.service.ts               # Sidebar toggle state (Angular signals)
│   │   └── studyset.service.ts              # Study set data from fake JS imports
│   ├── store/
│   │   ├── ai/
│   │   │   ├── ai.actions.ts                # Action creators for AI term generation
│   │   │   ├── ai.reducer.ts                # Reducer: updates AI state
│   │   │   ├── ai.effects.ts                # Effects: handles AI API calls
│   │   │   ├── ai.selectors.ts              # Selectors: aiUsage$, generatedTerms$
│   │   │   ├── ai.state.ts                  # State interface definition
│   │   │   └── index.ts                     # Public exports
│   │   ├── auth/
│   │   │   ├── auth.actions.ts              # Action creators with updateProfile actions
│   │   │   ├── auth.reducer.ts              # Reducer: updates auth state
│   │   │   ├── auth.effects.ts              # Effects: handles login, verify, profile API calls
│   │   │   ├── auth.selectors.ts            # Selectors: isAuthenticated$, user$, token$
│   │   │   ├── auth.state.ts                # State interface definition
│   │   │   └── index.ts                     # Public exports
│   │   ├── studyset/
│   │   │   ├── studyset.actions.ts          # Action creators (loadStudySets, create, update, delete)
│   │   │   ├── studyset.reducer.ts          # Reducer: updates studyset state with CRUD
│   │   │   ├── studyset.effects.ts          # Effects: calls StudySetService
│   │   │   ├── studyset.selectors.ts        # Selectors: selectAllStudySets$, selectById$
│   │   │   ├── studyset.state.ts            # State interface definition
│   │   │   └── index.ts                     # Public exports
│   │   ├── notification/
│   │   │   ├── notification.actions.ts      # Action creators for notifications
│   │   │   ├── notification.reducer.ts      # Reducer: manages notifications state
│   │   │   ├── notification.selectors.ts    # Selectors: selectNotifications$
│   │   │   ├── notification.state.ts        # State interface definition
│   │   │   └── index.ts                     # Public exports
│   │   ├── quiz/
│   │   │   ├── quiz.actions.ts              # Action creators for quiz state
│   │   │   ├── quiz.reducer.ts              # Reducer: manages quiz state
│   │   │   ├── quiz.state.ts                # State interface definition
│   │   │   └── index.ts                     # Public exports
│   │   ├── learning/
│   │   │   ├── learning.actions.ts          # Action creators for learning sessions
│   │   │   ├── learning.reducer.ts          # Reducer: manages learning state
│   │   │   ├── learning.state.ts            # State interface definition
│   │   │   └── index.ts                     # Public exports
│   │   ├── explore/
│   │   │   ├── explore.actions.ts           # Action creators for explore feature
│   │   │   ├── explore.reducer.ts           # Reducer: manages explore state
│   │   │   ├── explore.state.ts             # State interface definition
│   │   │   └── index.ts                     # Public exports
│   │   └── app.state.ts                     # Root AppState combining all features
│   ├── styles/
│   │   ├── _variables.scss                  # Color palette, spacing, sidebar width
│   │   └── _mixins.scss                     # Reusable SCSS mixins (flex, grid)
│   ├── types/
│   │   ├── index.ts                         # Interfaces: User, StudySet, Vocabulary, Quiz*
│   │   └── enum.ts                          # Enums: GENDER, ROLE, STATUS_ACCOUNT
│   ├── app.ts                               # Root component
│   ├── app.config.ts                        # Application configuration (providers)
│   ├── app.config.server.ts                 # SSR server-specific config
│   ├── app.routes.ts                        # Route definitions and guards
│   ├── app.routes.server.ts                 # SSR route configuration
│   └── app.spec.ts                          # App component tests
├── environments/
│   └── environment.ts                       # API base URL: https://server-898671149171...
├── styles.scss                              # Global styles (dark theme, primeicons)
├── main.ts                                  # Browser bootstrap
├── main.server.ts                           # SSR bootstrap
└── server.ts                                # Express.js SSR server

build/
├── angular.json                             # Angular build configuration
├── tsconfig.json                            # TypeScript configuration
├── tsconfig.app.json                        # App-specific TS config
└── tsconfig.server.json                     # SSR-specific TS config
```

## File Organization by Purpose

### Authentication
- `src/app/store/auth/` - NgRx auth state management
  - `auth.actions.ts` - Email verification, password reset, profile update actions
  - `auth.reducer.ts` - Handles verification, password reset, profile states
  - `auth.effects.ts` - Email verification, password reset, profile update API calls
  - `auth.selectors.ts` - Selectors including pendingVerificationEmail$, user$
  - `auth.state.ts` - AuthState interface with extended fields
- `src/app/services/auth.service.ts` - Auth facade with methods:
  - `login(email, password)` - Sign in user
  - `register(email, password, displayName)` - Register new user
  - `verifyEmail(token)` - Verify email with token
  - `resendVerification(email)` - Resend verification email
  - `forgotPassword(email)` - Request password reset
  - `resetPassword(token, password)` - Reset password with token
  - `updateProfile(data)` - Update user profile (name, avatar, etc.)
  - `changePassword(oldPassword, newPassword)` - Change password
  - `pendingVerificationEmail$` - Observable of pending email
- `src/app/guards/auth.guard.ts` - Route protection
- `src/app/interceptors/auth.interceptor.ts` - HTTP auth header injection
- `src/app/pages/signin/` - Sign-in page
- `src/app/pages/signup/` - Sign-up page with registration form
- `src/app/pages/verify-email-sent/` - Verification pending page (shows email, resend option, cooldown timer)
- `src/app/pages/verify-email/` - Email verification page (auto-extracts token, auto-verifies)
- `src/app/pages/forgot-password/` - Forgot password page (request reset email)
- `src/app/pages/reset-password/` - Reset password page (set new password with token)
- `src/app/pages/profile/` - User profile page (edit profile, change password)

### Study Sets & Vocabulary
- `src/app/store/studyset/` - NgRx studyset state with CRUD actions
- `src/app/services/studyset.service.ts` - Study set data access (HTTP calls or fake data)
- `src/app/fakeData/` - Static vocabulary datasets (JS files)
- `src/app/pages/library/` - Study set browse page with search, filter, view toggle, skeletons
- `src/app/pages/create-set/` - Create new study set with form and term editor
- `src/app/pages/set/:id/edit/` - Edit study set with form and term editor
- `src/app/components/common/studyset-card/` - Study set card component
- `src/app/components/common/studyset-form/` - Reusable form for create/edit operations
- `src/app/components/common/term-editor/` - Inline term editor with drag-drop support
- `src/app/components/common/search-toolbar/` - Search and filter toolbar
- `src/app/components/common/view-toggle/` - Grid/list view toggle

### Flashcard Learning
- `src/app/pages/studyset-detail/` - Flashcard viewer with progress bar, TTS, shuffle, mark-learned
- `src/app/components/common/flashcard/` - Reusable flashcard component with flip, TTS, shuffle
- `src/app/components/common/progress-bar/` - Progress indicator showing current position

### Quiz Mode
- `src/app/pages/quiz/` - Quiz with 3 types: Multiple Choice, True/False, Fill-in-the-blank
  - Timer per question with countdown
  - Fuzzy matching for fill-blank answers
  - Auto-advance on timeout
  - Results with score and accuracy

### Layout & Navigation
- `src/app/layouts/auth/` - Public pages wrapper (sign-in, sign-up, verify, password reset)
- `src/app/layouts/main/` - Protected pages wrapper (header + sidebar + content)
- `src/app/components/common/header/` - Top navigation bar with user menu
- `src/app/components/common/sidebar/` - Left menu with navigation links
- `src/app/components/common/loading-overlay/` - Global loading spinner overlay
- `src/app/components/common/empty-state/` - Empty state display for no results
- `src/app/components/common/stats-card/` - Statistics card component for dashboard
- `src/app/components/common/ai-usage-badge/` - AI feature usage stats display

### Data & Types
- `src/app/types/index.ts` - All TypeScript interfaces
- `src/app/types/enum.ts` - All enums
- `src/environments/environment.ts` - Configuration constants

### Styling
- `src/styles.scss` - Global styles
- `src/app/styles/_variables.scss` - SCSS variables (colors, spacing)
- `src/app/styles/_mixins.scss` - Reusable SCSS mixins

### Configuration
- `src/app/app.config.ts` - Provider setup (NgRx, HttpClient, PrimeNG, etc.)
- `src/app/app.routes.ts` - Route definitions
- `angular.json` - Build and development server configuration
- `tsconfig.json` - TypeScript compilation settings

## Key Files

| File | Purpose | Key Imports |
|------|---------|------------|
| `app.config.ts` | Application setup | provideStore, provideEffects, providePrimeNG |
| `app.routes.ts` | Route definitions | AuthGuard, AuthLayoutComponent, MainLayoutComponent |
| `auth.effects.ts` | Auth API & side effects | HttpClient, Router, loginRequest action |
| `auth.reducer.ts` | Auth state mutations | loginSuccess, loginFailure actions |
| `auth.service.ts` | Auth API facade | Store.select(), Store.dispatch() |
| `studyset.service.ts` | Study set data | Imports fake data JS, returns Observable |
| `quiz.ts` | Quiz page logic | Quiz state, timer, question shuffling |
| `flashcard.ts` | Reusable flashcard | Flip animation, signal for flip state |

## Module Dependencies (Key Imports)

### @angular/core
- `inject()` - Dependency injection in services
- `signal()`, `computed()` - Reactive local state
- `Component`, `Injectable` - Decorators

### @ngrx/store
- `createAction()`, `props()` - Action creators
- `createReducer()`, `on()` - Reducer setup
- `createSelector()` - Memoized selectors
- `Store<T>` - Store injection

### @ngrx/effects
- `createEffect()` - Effect creators
- `ofType()` - Action filtering
- `switchMap()`, `tap()`, `catchError()` - RxJS operators

### rxjs
- `BehaviorSubject` - Stateful observables
- `switchMap()`, `map()`, `catchError()` - Operators

### primeng
- `MessageService` - Toast notifications
- Various component modules (`ButtonModule`, etc.)

### @angular/common/http
- `HttpClient` - HTTP requests
- `HttpInterceptorFn` - Functional interceptors

## Code Statistics

| Metric | Count |
|--------|-------|
| TypeScript files | 85+ |
| HTML templates | 25+ |
| SCSS stylesheets | 30+ |
| Fake data files (JS) | 9 |
| Feature modules (NgRx) | 7 (auth, studyset, ai, quiz, learning, explore, notification) |
| Pages | 13 |
| Shared components | 15+ |
| Services | 8+ |
| Interceptors | 1 |
| Guards | 1 |

## Naming Conventions

### TypeScript Files
- Standalone components: `component-name.ts`
- Services: `service-name.service.ts`
- Guards: `guard-name.guard.ts`
- Interceptors: `interceptor-name.interceptor.ts`
- Specs: `filename.spec.ts`

### Templates & Styles
- Template: `component-name.html`
- SCSS: `component-name.scss`
- Global SCSS: `_variables.scss`, `_mixins.scss`

### NgRx Files
- Actions: `feature.actions.ts`
- Reducer: `feature.reducer.ts`
- Effects: `feature.effects.ts`
- Selectors: `feature.selectors.ts`
- State: `feature.state.ts`
- Index (exports): `index.ts`

### Class Names
- Components: PascalCase (DashboardPage, SigninComponent)
- Services: PascalCase with Service suffix (AuthService)
- Guards: PascalCase with Guard suffix (AuthGuard)

### Selector Functions
- Format: `select{EntityName}` (selectAllStudySets, selectCurrentUser)
- Memoized for performance

### CSS Classes
- BEM format: `.block__element--modifier`
- Dark theme colors from variables

## Configuration Files

### angular.json
- Development server config (port 4200, HMR)
- Build config (production optimization)
- SSR configuration
- Test configuration (Karma)

### tsconfig.json
- TypeScript compilation settings
- Strict mode enabled
- ES2022 target
- Path aliases configured

### environment.ts
- API base URL
- Debug mode flag

### CLAUDE.md
- Project-specific development guidelines
- Architecture decisions documented
- Development commands reference

## Data Flow Summary

```
User Input (Template)
    ↓
Component (Signal/Input)
    ↓
Service.dispatch(action) or Service.subscribe()
    ↓
NgRx Store
    ├→ Reducer (sync state update)
    ├→ Effect (side effects: HTTP, navigation, toast)
    └→ Selector (component receives updated state)
    ↓
Template (async pipe renders)
```

## Bootstrap Flow

1. `main.ts` - Loads `AppComponent`
2. `app.config.ts` - Configures: NgRx, HttpClient, PrimeNG, SSR
3. `app.routes.ts` - Sets up routing with guards
4. `app.ts` - Root component with router outlet
5. Routes load layouts (AuthLayout or MainLayout)
6. Layouts load pages and shared components
