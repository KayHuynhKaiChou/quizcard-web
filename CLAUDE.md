# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20.3 application using standalone components with zoneless change detection, Server-Side Rendering (SSR), NgRx for state management, and PrimeNG for UI components.

## Development Commands

### Development Server
```bash
npm start
# or
ng serve
```
Development server runs at `http://localhost:4200/` with hot reload.

### Build
```bash
npm run build          # Production build
npm run watch          # Development build with watch mode
```
Production builds output to `dist/` directory.

### Testing
```bash
npm test               # Run all tests with Karma
ng test                # Same as above
```

### SSR Server
```bash
npm run serve:ssr:first-angular
```
Runs the SSR server from `dist/first-angular/server/server.mjs`.

### Code Generation
```bash
ng g c pages/component-name           # Generate component in pages
ng g c components/common/name         # Generate component in components/common
```

## Architecture

### State Management (NgRx)

**Store Structure**: Uses feature-based state slicing with NgRx Effects pattern.
- State is organized in `src/app/store/` with feature folders: `auth/`, `studyset/`, `notification/`, `quiz/`, `learning/`, `explore/`, `ai/`
- Each feature has: actions, reducer, effects, selectors, and state files
- **AppState**: Combines all features - `auth`, `studySet`, `notification`, `quiz`, `learning`, `explore`, `ai`
- **LocalStorage Persistence**: Implemented via `ngrx-store-localstorage` meta reducer in [app.config.ts](src/app/app.config.ts:40-54)
  - Only syncs `auth` slice when `!state.auth?.error && !state.auth?.isLoading`
  - SSR-safe: checks for `localStorage` availability
- **Store Registration**: All reducers and effects registered in [app.config.ts](src/app/app.config.ts:77-99) via `provideStore()` and `provideEffects()`
- **Store DevTools**: Enabled in [app.config.ts](src/app/app.config.ts:101-107) for debugging

**Effect Pattern**:
- Effects handle side effects (API calls, navigation, toasts) via [auth.effects.ts](src/app/store/auth/auth.effects.ts)
- Use `switchMap()` for cancellable operations (e.g., login requests)
- Services dispatch actions, effects listen via `ofType()`, then call APIs
- Effects must set `{ dispatch: false }` when not dispatching another action

**Service Layer**: [AuthService](src/app/services/auth.service.ts) acts as facade
- Exposes observables via selectors: `isAuthenticated$`, `user$`, `token$`, etc.
- Provides synchronous getters (`getToken()`, `getCurrentUser()`) for interceptors/guards
- All state mutations go through actions: `login()`, `logout()`, `loadUserProfile()`

### Routing & Guards

**Layout-based Routing**: [app.routes.ts](src/app/app.routes.ts) uses two main layouts:
- `AuthLayoutComponent`: Public routes (signin)
- `MainLayoutComponent`: Protected routes (dashboard, library, notifications) with `AuthGuard`

**AuthGuard**: [auth.guard.ts](src/app/guards/auth.guard.ts) implements `CanActivate`
- Checks for token in store via selectors
- Redirects to `/signin` if no token exists
- Uses `take(1)` to complete observable after single check

### HTTP & Interceptors

**Auth Interceptor**: [auth.interceptor.ts](src/app/interceptors/auth.interceptor.ts)
- Functional interceptor pattern (Angular 20 style)
- Skips auth header for public URLs matching patterns: `/api/auth/login`, `/api/auth/register`, `/api/auth/verify-email`, `/api/auth/resend-verification`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/refresh`, `/api/explore/`, `/api/health`
- Adds `Authorization: Bearer ${token}` header for all other protected endpoints
- Gets token synchronously from AuthService

**HTTP Client**: Configured with `withFetch()` and interceptors in [app.config.ts](src/app/app.config.ts:54-57)

### Services

**LoadingService**: [loading.service.ts](src/app/services/loading.service.ts)
- Global loading state using `BehaviorSubject`
- Used by effects to show/hide loading overlay during async operations
- Exposes both observables (`isLoading$`) and synchronous getters

**SidebarService**: [sidebar.service.ts](src/app/services/sidebar.service.ts)
- Uses Angular signals for sidebar state management
- Provides `toggle()`, `open()`, `close()` methods
- Signal pattern: private writable, public readonly

### Component Patterns

**Standalone Components**: All components are standalone (`standalone: true`)
- Import dependencies directly in component metadata
- No NgModule declarations needed
- Component files use `.ts` extension (not `.component.ts`)

**Zoneless Change Detection**:
- Uses `provideZonelessChangeDetection()` in [app.config.ts](src/app/app.config.ts:42)
- Relies on signals and async pipe for reactivity
- More performant than zone.js-based change detection

**SSR Considerations**:
- All components must be SSR-compatible
- Check `isPlatformBrowser` before using browser-only APIs (localStorage, window, etc.)
- Functions run twice: once on server, once on client
- LocalStorage sync meta reducer handles SSR safety

### Styling

**SCSS**: Component styles use SCSS (configured in [angular.json](angular.json:10))
- Global styles in [src/styles.scss](src/styles.scss)
- Component-specific styles use `styleUrl` (not `styleUrls`)

**PrimeNG Theme**:
- Uses Aura preset from `@primeuix/themes`
- Configured in [app.config.ts](src/app/app.config.ts:47-52)
- Icons from `primeicons` package

### File Naming Conventions

- Components: `component-name.ts` (not `.component.ts`)
- Templates: `component-name.html`
- Styles: `component-name.scss`
- Tests: `component-name.spec.ts`

### Environment Configuration

- Development config in [src/environments/environment.ts](src/environments/environment.ts)
- API base URL: `http://localhost:8080/api` (Java Spring Boot backend)

## Key NgRx Patterns Used

**Actions**: Created with `createAction()` from `@ngrx/store`
- Follow naming pattern: `[Feature] Action Name`
- Group by feature: request/success/failure triplets

**Reducers**: Created with `createReducer()` and `on()` handlers
- Immutable updates using spread operator
- Handle all action types for the feature slice

**Effects**: Created with `createEffect()` and RxJS operators
- `ofType()` to filter actions
- `switchMap()` for API calls (auto-cancels previous)
- `tap()` for side effects (navigation, toasts)
- `catchError()` to dispatch failure actions
- `finalize()` for cleanup (hide loading)

**Selectors**: Created with `createSelector()` for memoized state derivation

## API Integration

### Backend Connection

The application connects to a Java Spring Boot backend running at `http://localhost:8080/api` with 30 REST API endpoints. All API calls are made through service layer classes that dispatch NgRx actions, which are handled by effects.

### Authentication Flow

**Credentials**: Email/password based authentication (not username/password)

**Token Management**:
- Backend returns two tokens on successful login: `accessToken` and `refreshToken`
- `accessToken` is stored in NgRx store and used for API authorization
- `refreshToken` is handled by refresh endpoint for token renewal
- Auth state persists to localStorage for session resumption

**Service**: [AuthService](src/app/services/auth.service.ts)
- Dispatches auth actions: `login()`, `register()`, `logout()`, `refreshToken()`
- Exposes selectors: `isAuthenticated$`, `user$`, `accessToken$`, etc.
- Provides synchronous getters: `getToken()`, `getCurrentUser()` for interceptors/guards

### API Endpoint Categories

**Auth Endpoints** (`/api/auth/*`):
- `POST /api/auth/login` - Login with email/password, returns accessToken + refreshToken
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/refresh` - Refresh accessToken using refreshToken
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (authenticated)

**User Endpoints** (`/api/users/*`):
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

**Study Sets Endpoints** (`/api/study-sets/*`):
- `GET /api/study-sets` - List all study sets with pagination
- `POST /api/study-sets` - Create new study set
- `GET /api/study-sets/{id}` - Get study set details
- `PUT /api/study-sets/{id}` - Update study set
- `DELETE /api/study-sets/{id}` - Delete study set
- `POST /api/study-sets/{id}/clone` - Clone existing study set
- `POST /api/study-sets/{id}/terms` - Add term to study set
- `PUT /api/terms/{id}` - Update term
- `DELETE /api/terms/{id}` - Delete term

**Quiz Endpoints** (`/api/quiz/*`):
- `POST /api/quiz/generate` - Generate quiz for study set
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get quiz history with statistics

**Learning Endpoints** (`/api/learning/*`):
- `GET /api/learning/today` - Get today's review schedule
- `POST /api/learning/submit` - Submit review result
- `GET /api/learning/stats` - Get learning statistics

**Explore Endpoints** (`/api/explore/*`, public):
- `GET /api/explore/trending` - Get trending study sets
- `GET /api/explore/search` - Search study sets
- `GET /api/explore/categories` - Get available categories

**Notification Endpoints** (`/api/notifications/*`):
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

**AI Endpoints** (`/api/ai/*`):
- `GET /api/ai/usage` - Get AI feature usage stats
- `POST /api/ai/generate-terms` - Generate terms using AI
- `POST /api/ai/extract-from-text` - Extract terms from text using AI

### Service Layer

Each feature has a dedicated service that handles HTTP communication:

**StudySetService**: [studyset.service.ts](src/app/services/studyset.service.ts)
- Makes real HTTP calls to `/api/study-sets` endpoints
- Dispatches actions: `loadStudySets()`, `createStudySet()`, `updateStudySet()`, `deleteStudySet()`, `cloneStudySet()`
- Effects listen via `ofType()` and call service methods

**QuizService**: Manages quiz operations via `/api/quiz` endpoints

**LearningService**: Manages learning/review operations via `/api/learning` endpoints

**ExploreService**: Manages public explore endpoints via `/api/explore` endpoints

**NotificationService**: Manages notification operations via `/api/notifications` endpoints

**AiService**: Manages AI feature operations via `/api/ai` endpoints

### Type Definitions

All TypeScript types match Java Spring Boot DTOs. Key types include:

- `User` - User profile with email, id, createdAt, etc.
- `StudySet` - Study set metadata with title, description, termCount
- `StudySetDetail` - Full study set with terms array
- `Term` - Individual flashcard with term, definition, examples
- `Quiz` - Quiz session data with questions, answers, score
- `LearningSession` - Daily review session with scheduled terms
- `Notification` - User notification with type, message, read status
- `ApiError` - Error response from backend

## Prettier Configuration

Prettier is configured in [package.json](package.json:12-23):
- Print width: 100
- Single quotes
- Angular parser for HTML files

## Git Workflow & Conventions

### 1. Branch Naming Rules
When creating a new branch, ALWAYS follow this pattern: `category/short-description`
- **Categories**:
  - `feat/`: For new features
  - `fix/`: For bug fixes
  - `docs/`: For documentation changes
  - `chore/`: For maintenance tasks
- **Example**: `feat/user-login`, `fix/header-alignment`
- **Requirement**: Always verify if a branch exists before creating. Use kebab-case.

### 2. Commit Message Template
All commit messages MUST follow this format strictly:
- **Categories**: FEAT, FIX, UI, REFACTOR
- **Emojis**: 
  - FEAT: ✨
  - FIX: 🐛
  - UI: 🎨
  - REFACTOR: ♻️

### 3. Push Command
When asked to "push code":
1. Check current status (`git status`).
2. Add all changes (`git add .`).
3. Commit using the template above based on the changes.
4. Push to origin with the current branch name (`git push -u origin <branch_name>`).