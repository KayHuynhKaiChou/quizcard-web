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
- State is organized in `src/app/store/` with feature folders (currently `auth/`)
- Each feature has: actions, reducer, effects, selectors, and state files
- **LocalStorage Persistence**: Implemented via `ngrx-store-localstorage` meta reducer in [app.config.ts](src/app/app.config.ts:20-37)
  - Only syncs when `!state.auth?.error && !state.auth?.isLoading`
  - SSR-safe: checks for `localStorage` availability
- **Store DevTools**: Enabled in [app.config.ts](src/app/app.config.ts:66-72) for debugging

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
- Skips auth header for public URLs: `/account/sign-in`, `/account/sign-up`, `/account/forgot-password`
- Adds `Authorization: Bearer ${token}` header for protected endpoints
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
- API base URL: `https://server-898671149171.asia-southeast1.run.app`

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