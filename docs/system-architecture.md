# System Architecture

## High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / SSR Server                     │
├─────────────────────────────────────────────────────────────────┤
│                      Angular 20.3 Application                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Router    │→ │   Guards     │→ │  Layouts             │   │
│  │             │  │  (AuthGuard) │  │  - AuthLayout        │   │
│  └─────────────┘  └──────────────┘  │  - MainLayout        │   │
│                                      └──────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Pages (signin, dashboard, library, quiz, studyset-detail)      │
│                                                                 │
│  ↓ dispatch action / subscribe to store                         │
│                                                                 │
│  ┌──────────────────── NgRx Store ──────────────────┐           │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────────┐   │           │
│  │  │  Action │→ │ Reducer  │→ │   State Tree   │   │           │
│  │  └─────────┘  └──────────┘  └────────────────┘   │           │
│  │                                                   │           │
│  │  ┌─────────┐                  ┌────────────────┐ │           │
│  │  │ Effects │→ Side Effects    │   Selectors    │ │           │
│  │  │(HTTP,nav)← API Response    │(memoized view) │ │           │
│  │  └─────────┘                  └────────────────┘ │           │
│  │                                                   │           │
│  │  ┌─────────────────────────────────────────────┐ │           │
│  │  │  localStorage (ngrx-store-localstorage)     │ │           │
│  │  │  ↕ Persist auth slice on change             │ │           │
│  │  └─────────────────────────────────────────────┘ │           │
│  └───────────────────────────────────────────────────┘           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              Services (facade, loading, sidebar)                │
├─────────────────────────────────────────────────────────────────┤
│            HttpClient with auth Interceptor                     │
├─────────────────────────────────────────────────────────────────┤
│                        REST API Server                          │
│         https://server-898671149171.asia-southeast1...          │
└─────────────────────────────────────────────────────────────────┘
```

## State Management Architecture (NgRx)

### AppState Structure
```typescript
AppState = {
  ai: AiState {
    generatedTerms: Term[];
    aiUsage: { used: number; limit: number };
    isLoading: boolean;
    error: string | null;
  };

  auth: AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    pendingVerificationEmail: string | null;
  };

  explore: ExploreState {
    trendingStudySets: StudySet[];
    searchResults: StudySet[];
    isLoading: boolean;
    error: string | null;
  };

  learning: LearningState {
    todaySchedule: Term[];
    sessionStats: SessionStats;
    isLoading: boolean;
    error: string | null;
  };

  notification: NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
  };

  quiz: QuizState {
    currentQuiz: Quiz | null;
    questions: Question[];
    currentQuestionIndex: number;
    answers: QuizAnswer[];
    timeStarted: number | null;
    isLoading: boolean;
    error: string | null;
  };

  studySet: StudySetState {
    studySets: StudySet[];
    selectedStudySet: StudySetDetail | null;
    searchResults: StudySet[];
    isLoading: boolean;
    error: string | null;
  };
}
```

### NgRx Action Flow Diagram

```
User Action (Click, Form Submit)
        ↓
Component dispatches action
        ↓
[Auth Feature]
    loginRequest({ username, password })
        ↓
    Effect: loginRequest$
    ├→ tap: show loading overlay
    ├→ switchMap: POST /account/sign-in
    ├→ map: loginSuccess(user, token)  OR
    └→ catchError: loginFailure(error)
        ↓
    Reducer processes action
    ├→ on(loginSuccess): update state with user/token
    ├→ MetaReducer: persist to localStorage
    └→ store state updated
        ↓
    New Effects triggered:
    ├→ loginSuccess$ effect: navigate to '/'
    ├→ messageService: show success toast
    └→ other subscribers notified
        ↓
Component receives state via selector
        ↓
Async pipe updates template
        ↓
User sees updated UI
```

### Authentication State Flow

```
[Unauthenticated]
    ↓
Path 1: Sign In
├─ User submits SignIn form
├─ dispatch loginRequest { email, password }
├─ Effect: POST to /api/auth/login
├─ Success: dispatch loginSuccess → navigate to / → [Authenticated]
└─ Failure: dispatch loginFailure → show error toast → stay on /signin

Path 2: Sign Up with Email Verification
├─ User submits SignUp form
├─ dispatch registerRequest { email, password, ... }
├─ Effect: POST to /api/auth/register
├─ Success:
│  ├─ dispatch registerSuccess
│  ├─ Store pendingVerificationEmail
│  └─ Navigate to /verify-email-sent
├─ Show timer and resend option
├─ User receives verification email with token
├─ User clicks email link or enters token
├─ Navigate to /verify-email?token=xxx
├─ dispatch verifyEmailRequest { token }
├─ Effect: POST to /api/auth/verify-email with token
├─ Success:
│  ├─ dispatch verifyEmailSuccess
│  ├─ Update state with user and tokens
│  └─ Auto-navigate to / → [Authenticated]
└─ Failure: dispatch verifyEmailFailure → show error → allow resend
```

**Email Verification Flow**:
1. Register → verification email sent → /verify-email-sent
2. User clicks email link (contains token) → navigate to /verify-email?token=xxx
3. Token auto-extracted from URL → auto-verify without user input
4. Fallback: Manual token entry if user lost email link
5. Resend option (with rate limiting and cooldown timer)
6. Success → auto-login and redirect to dashboard
7. Failure → allow retry or resend verification email

**New Auth State Field**: `pendingVerificationEmail: string | null`
- Stores email awaiting verification
- Cleared after successful verification or timeout
- Used to display email on /verify-email-sent page

**Local Persistence**: AuthState.auth slice is automatically synced to localStorage via ngrx-store-localstorage meta reducer. On app restart, auth state is rehydrated from storage if no error occurred.

### Study Set State Flow

```
Library Page loads
    ↓
dispatch loadStudySets action
    ↓
Effect: StudySetService.getStudySets()
    (Currently returns fake data from JS imports)
    ↓
dispatch loadStudySetsSuccess { studySets[] }
    ↓
Reducer: update state.studySet.studySets
    ↓
Selector: selectAllStudySets notifies component
    ↓
Template renders grid of StudySetCard components
```

## HTTP Request Pipeline

### Auth Interceptor Flow

```
Component calls: this.http.get('/studyset')
    ↓
HttpClient applies authInterceptor
    ↓
Check if URL is public endpoint
    (e.g., /account/sign-in, /account/sign-up)
    ├─ YES: Pass through without auth header
    └─ NO: Get token from AuthService
        ↓
    Token exists?
        ├─ YES: Add "Authorization: Bearer {token}" header
        └─ NO: Send without auth header
    ↓
Request sent to API
    ↓
Response received → Response interceptor (future)
    ↓
Component receives typed response
```

### Error Handling

```
HTTP Request fails (4xx, 5xx)
    ↓
Effect's catchError() handles
    ├→ 401 Unauthorized
    │  ├→ Clear auth state
    │  ├→ Dispatch logout action
    │  └→ Navigate to /signin
    │
    ├→ Other errors
    │  ├→ Dispatch failure action
    │  └→ Show error toast via MessageService
    │
    └→ Network error
       └→ Show "Network error" toast

Component receives error via state
    ↓
Template displays error message / loading state
```

## Routing Architecture

### Route Guard: AuthGuard

```
User navigates to protected route (e.g., /library)
    ↓
AuthGuard.canActivate() checks
    ↓
Select token from store
    ├─ Token exists → ALLOW navigation
    └─ No token → DENY, redirect to /signin
```

### Route Structure

```
/                          (DashboardPage, guarded by AuthGuard)
├── MainLayoutComponent
│   ├── header
│   ├── sidebar
│   └── <router-outlet>
│
/library                   (LibraryPage, guarded, with search & filter)
/create-set                (CreateSetPage, guarded, study set creation form)
/set/:id                   (StudySetDetailPage, guarded, flashcard viewer)
/set/:id/edit              (EditSetPage, guarded, study set editing)
/quiz/:id                  (QuizPage, guarded, MC/T-F/Fill-blank types)
/profile                   (ProfilePage, guarded, edit profile & password)
/ai-generate               (AiGeneratePage, guarded, AI term generation)
/notifications             (NotificationsPage, guarded, user alerts)

/signin                    (SigninPage, PUBLIC)
├── AuthLayoutComponent
│   └── <router-outlet>

/signup                    (SignupPage, PUBLIC)
├── AuthLayoutComponent
│   └── <router-outlet>

/forgot-password           (ForgotPasswordPage, PUBLIC)
├── AuthLayoutComponent
│   └── <router-outlet>

/reset-password?token=xxx  (ResetPasswordPage, PUBLIC)
├── AuthLayoutComponent
│   └── <router-outlet>

/verify-email-sent         (VerifyEmailSentPage, PUBLIC - post-registration)
├── AuthLayoutComponent
│   └── <router-outlet>

/verify-email?token=xxx    (VerifyEmailPage, PUBLIC - auto-verifies from URL)
├── AuthLayoutComponent
│   └── <router-outlet>
```

### Lazy Loading

```typescript
// Lazy-loaded routes (code-split automatically)
{
  path: 'set/:id',
  loadComponent: () => import('./pages/studyset-detail/studyset-detail')
    .then(m => m.StudySetDetailPage)
}

// Benefit: /set and /quiz bundles loaded only when accessed
```

## API Types for Email Verification

```typescript
// Request types (src/app/types/index.ts)
interface VerifyEmailRequest {
  token: string;
}

interface ResendVerificationRequest {
  email: string;
}

// Related types
interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

interface MessageResponse {
  message: string;
}
```

**API Endpoints Used**:
- `POST /api/auth/register` - Takes RegisterRequest, returns MessageResponse (verification email sent)
- `POST /api/auth/verify-email` - Takes VerifyEmailRequest, returns { accessToken, refreshToken, user } (auto-login)
- `POST /api/auth/resend-verification` - Takes ResendVerificationRequest, returns MessageResponse

## Service Layer Architecture

### AuthService (Facade Pattern)

```
AuthService
├── Public observables (for templates)
│   ├── isAuthenticated$ (selector)
│   ├── user$ (selector)
│   ├── token$ (selector)
│   ├── refreshToken$ (selector)
│   └── pendingVerificationEmail$ (selector)
├── Sync getters (for guards/interceptors)
│   ├── getToken(): string | null
│   ├── getCurrentUser(): User | null
│   └── getPendingVerificationEmail(): string | null
└── Action dispatchers
    ├── login(email, password)
    ├── register(email, password, displayName)
    ├── logout()
    ├── verifyEmail(token)
    ├── resendVerification(email)
    ├── forgotPassword(email)
    ├── resetPassword(token, password)
    ├── updateProfile(data)
    ├── changePassword(oldPassword, newPassword)
    └── loadUserProfile()
```

**Why**: Components never import NgRx directly. Services provide clean API.

### LoadingService (Global State)

```
LoadingService (BehaviorSubject)
├── show(message: string)
├── hide()
├── isLoading$ observable
└── isLoading: boolean (getter)
```

**Used by**: Effects to show/hide global loading spinner during async operations.

### SidebarService (Angular Signals)

```
SidebarService (Signal-based)
├── isOpen (readonly signal)
└── Methods
    ├── toggle()
    ├── open()
    └── close()
```

**Used by**: Header component to toggle sidebar, sidebar observes isOpen signal.

### StudySetService (Data Access)

```
StudySetService
├── getStudySets(): Observable<StudySet[]>
│   └── Returns fake data from JS imports
├── getStudySetById(id: string): Observable<StudySet>
└── (Future) API calls when backend is ready
```

## NgRx Email Verification Actions

New actions added to auth feature:

```typescript
// Verify Email Triplet
verifyEmailRequest({ token: string })
verifyEmailSuccess({ user: User; accessToken: string; refreshToken: string })
verifyEmailFailure({ error: string })

// Resend Verification Email Triplet
resendVerificationRequest({ email: string })
resendVerificationSuccess({ message: string })
resendVerificationFailure({ error: string })
```

**Action Flow for Email Verification**:
1. User registers → `registerSuccess` dispatches (stores pendingVerificationEmail)
2. /verify-email-sent page displays pending email
3. User clicks email link with token → navigate to /verify-email?token=xxx
4. VerifyEmailPage extracts token from URL query params
5. Dispatch `verifyEmailRequest({ token })`
6. Effect: POST /api/auth/verify-email with token
7. On success: Dispatch `verifyEmailSuccess` → auto-login + navigate to /
8. On failure: Show error, allow resend via `resendVerificationRequest`

## Data Flow Example: Sign Up with Email Verification

```
1. User fills signup form on /signup
   SignupPage component
   └── Submits with email, password, displayName

2. Dispatch registerRequest action
   Store.dispatch(registerRequest({email, password, displayName}))

3. Effect: registerRequest$ intercepts
   ├── tap: LoadingService.show('Đang tạo tài khoản...')
   ├── switchMap: HttpClient.post('/api/auth/register', credentials)
   └── Waits for API response

4. API responds (success)
   { message: 'Registration successful. Check your email.' }
   └── Effect maps to registerSuccess action

5. Reducer processes registerSuccess
   ├── Set pendingVerificationEmail = email
   ├── Clear error and isLoading
   └── Store state updated

6. Effect triggered by registerSuccess
   ├── tap: MessageService.add('Verification email sent')
   └── tap: Router.navigate(['/verify-email-sent'])

7. /verify-email-sent page loads
   ├── Displays: "Check your email at: [email]"
   ├── Shows: Resend button (initially disabled with 60s timer)
   ├── Shows: Manual token entry form (optional)
   └── User clicks email link containing token

8. Browser navigates to /verify-email?token=abc123xyz
   └── VerifyEmailPage extracts token from query params

9. VerifyEmailPage auto-dispatches verifyEmailRequest
   Store.dispatch(verifyEmailRequest({token}))

10. Effect: verifyEmailRequest$ intercepts
    ├── switchMap: HttpClient.post('/api/auth/verify-email', {token})
    ├── map: verifyEmailSuccess(user, accessToken, refreshToken)
    └── OR catchError: verifyEmailFailure(error)

11. Reducer processes verifyEmailSuccess
    ├── Update state: user, token, refreshToken, isAuthenticated
    ├── Clear: error, isLoading, pendingVerificationEmail
    └── localStorage persists auth state

12. Effects triggered by verifyEmailSuccess
    ├── tap: MessageService.add('Email verified successfully!')
    ├── tap: Router.navigate(['/'])
    └── User now fully authenticated

13. DashboardPage loads (AuthGuard allows access)
    ├── User sees their dashboard
    └── Session persists via localStorage
```

## Data Flow Example: Login to Dashboard

```
1. User enters credentials on /signin
   SigninPage component
   └── Submits reactive form with email/password

2. Component dispatches action
   authService.login(email, password)
   └── Store.dispatch(loginRequest({email, password}))

3. NgRx Effect intercepts
   auth.effects.ts - login$ effect
   ├── tap: LoadingService.show('Đang đăng nhập...')
   ├── switchMap: HttpClient.post('/account/sign-in', credentials)
   └── Waits for API response

4. API responds (success)
   {success: true, result: {id, username, token, ...}}
   └── Effect maps to loginSuccess action

5. Reducer processes action
   AuthReducer - on(loginSuccess)
   ├── Update state: user, token, refreshToken, isAuthenticated
   ├── Clear: error, isLoading
   └── MetaReducer automatically persists to localStorage

6. Effects triggered by loginSuccess
   ├── loginSuccess$ effect:
   │   ├── tap: MessageService.add('Đăng nhập thành công')
   │   └── tap: Router.navigate(['/'])
   └── Component unsubscribes from SigninPage

7. Navigation to Dashboard
   AuthGuard checks token (✓ exists)
   └── Allow navigation to DashboardPage

8. DashboardPage loads
   ├── dispatch loadStudySets action
   ├── Effect: StudySetService.getStudySets()
   ├── dispatch loadStudySetsSuccess
   └── Template renders study sets via async pipe

9. User sees dashboard
   All loaded from store with localStorage persistence
```

## Component Interaction Patterns

### Parent-Child Communication

```
ParentComponent
  │
  ├─ @Input() vocabulary: Vocabulary
  │  └── Child receives data immutably
  │
  ├─ @Output() cardFlipped: EventEmitter<boolean>
  │  └── Child emits to parent via event
  │
  └─ ChildComponent
     ├─ Receives: vocabulary input
     ├─ Emits: cardFlipped event
     └─ Manages: local flip state via signal

ParentTemplate:
<app-flashcard
  [vocabulary]="vocab$ | async"
  (cardFlipped)="onFlipCard($event)"
/>
```

### Store to Component Flow

```
Store (Single Source of Truth)
  ↓
Selector (memoized view)
  ↓
Component property: observable$ = this.store.select(selector)
  ↓
Template: {{ observable$ | async as data }}
  ↓
Control: @if, @for with data
  ↓
User interaction
  ↓
Component dispatches action
  ↓
Back to Store (cycle repeats)
```

## Performance Optimization

### Change Detection (Zoneless)
```typescript
// Instead of zone.js monkey-patching
provideZonelessChangeDetection()

// Components use signals for explicit reactivity
isFlipped = signal(false)

// Template reflects signal changes without full app check
{{ isFlipped() }}
```

### Selector Memoization
```typescript
// Selectors are memoized by default
selectAllStudySets = createSelector(
  selectStudySetFeature,
  (state) => state.studySets
);

// Even if store updates elsewhere, component doesn't re-render
// because selector result is same reference (memoized)
```

### Lazy Loading
```typescript
// Loaded on-demand
{
  path: 'quiz/:id',
  loadComponent: () => import('./pages/quiz/quiz')
    .then(m => m.QuizPage)
}

// QuizPage bundle only loaded when /quiz/:id is accessed
```

## SSR (Server-Side Rendering) Architecture

### Bootstrap Flow

```
Server Request
  ↓
server.ts (Express) - main.server.ts
  ├─ Apply AppConfig
  ├─ Render AppComponent to HTML
  ├─ Check localStorage availability
  │  └─ Skip in SSR, only client rehydrates
  ├─ localStorageSyncReducer (disabled in SSR)
  └─ Return full HTML + inline state

  ↓
HTML sent to client (TTFB)

  ↓
Client Request (main.ts)
  ├─ provideClientHydration(withEventReplay())
  ├─ Rehydrate state from localStorage
  ├─ localStorageSyncReducer enabled on client
  └─ Full interactivity enabled

User sees pre-rendered page + interactive app
```

### SSR Safety

```typescript
// app.config.ts - MetaReducer checks environment
if (typeof localStorage === 'undefined') {
  // SSR mode - skip localStorage sync
  return reducer;
}

// Browser mode - enable localStorage sync
return localStorageSync({...})(reducer);
```

## Error Handling Architecture

### Global Error Handler
```typescript
// app.config.ts
provideBrowserGlobalErrorListeners()

// Catches uncaught errors and navigation errors
```

### Component-Level Errors
```typescript
// In effects
catchError((error) =>
  of(AuthActions.loginFailure({
    error: error.error?.message || 'Unknown error'
  }))
)

// In state
error: string | null

// In template
@if ((error$ | async) as error) {
  <p class="error">{{ error }}</p>
}
```

### User Feedback
```typescript
// Via PrimeNG MessageService
messageService.add({
  severity: 'error',
  summary: 'Lỗi',
  detail: error.message,
  life: 3000
})
```

## Scalability Considerations

### Feature Scaling
```
Current: 7 features (auth, studyset, ai, quiz, learning, explore, notification)

Architecture supports growth:
├── ai (AI term generation)
├── auth (authentication & profile)
├── explore (public study sets)
├── learning (spaced repetition - future)
├── notification (user alerts)
├── quiz (quiz sessions & results)
└── studyset (CRUD operations)

Each feature follows pattern:
  feature/
  ├── actions.ts
  ├── reducer.ts
  ├── effects.ts (optional)
  ├── selectors.ts
  ├── state.ts
  └── index.ts (exports)
```

### State Normalization (Future)
```
Current state:
studySets: StudySet[] (flat array)

After normalization:
entities: { [id]: StudySet }
ids: string[]
selectedId: string | null

Benefits:
- Efficient updates
- Better performance with large datasets
- Easier CRUD operations
```

### API Response Caching (Future)
```
Effect should implement:
├── Check cache first (in state)
├── If cache valid, return cached data
├── If cache expired or missing, call API
├── Store response in state with timestamp
└── Auto-invalidate after TTL
```
