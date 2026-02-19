# Code Standards & Conventions

## Angular Component Patterns

### Standalone Components
All components are **standalone** (`standalone: true`). No NgModules are used.

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './example.html',
  styleUrl: './example.scss'
})
export class ExampleComponent {
  // Component logic
}
```

**Why**: Simpler imports, easier code-splitting, lighter bundles, modern Angular practice.

### Dependency Injection via `inject()`
Use the `inject()` function instead of constructor parameters.

```typescript
// ✓ Correct (modern Angular 14+)
export class MyService {
  private http = inject(HttpClient);
  private store = inject(Store);
}

// ✗ Avoid (old pattern)
export class MyService {
  constructor(private http: HttpClient) {}
}
```

**Why**: Cleaner syntax, works better with tree-shaking, no circular dependency issues.

### Standalone Signals for Local State
Use Angular `signal()` for local component state (not observable).

```typescript
import { signal, computed } from '@angular/core';

export class FlashcardComponent {
  // Local state as signal
  isFlipped = signal(false);
  cardCount = signal(0);

  // Computed value (auto-memoized)
  progress = computed(() => {
    return `${this.cardCount()} cards`;
  });

  toggleFlip() {
    this.isFlipped.update(val => !val);
  }
}
```

**In template**: `{{ isFlipped() ? 'Back' : 'Front' }}`

**Why**: Signals are the new Angular reactivity model. Explicit, performant, less boilerplate than observables.

### Template Control Flow
Use modern `@if`, `@for` syntax instead of `*ngIf`, `*ngFor`.

```html
<!-- ✓ Correct (Angular 17+) -->
@if (user$ | async as user) {
  <p>Welcome, {{ user.name }}</p>
} @else {
  <p>Not logged in</p>
}

@for (item of items$ | async; track item.id) {
  <p>{{ item.name }}</p>
}

<!-- ✗ Avoid -->
<p *ngIf="user$ | async as user">Welcome, {{ user.name }}</p>
<p *ngFor="let item of items$ | async">{{ item.name }}</p>
```

**Why**: Better performance, clearer syntax, built-in tracking for ngFor.

### Observable Subscriptions in Templates
Always use the `async` pipe. Never manually subscribe in components.

```typescript
// ✓ Correct
export class DashboardComponent {
  studySets$ = this.store.select(selectAllStudySets);
}

// Template:
// @for (set of studySets$ | async; track set.id) { ... }

// ✗ Avoid - memory leaks
export class DashboardComponent {
  studySets: StudySet[] = [];

  constructor(private store: Store) {
    this.store.select(selectAllStudySets).subscribe(sets => {
      this.studySets = sets;
    });
  }
}
```

**Why**: Async pipe automatically unsubscribes, preventing memory leaks.

### Input/Output Naming
Use Angular 17.1+ `input()` and `output()` for cleaner decorator syntax.

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  template: `...`
})
export class FlashcardComponent {
  // Modern input/output syntax
  vocabulary = input.required<Vocabulary>();
  cardFlipped = output<boolean>();

  toggleFlip() {
    this.cardFlipped.emit(!this.isFlipped);
  }
}

// ✓ Also acceptable: @Input/@Output if project uses 20.3
@Component({...})
export class LegacyComponent {
  @Input() required vocabulary: Vocabulary;
  @Output() cardFlipped = new EventEmitter<boolean>();
}
```

## NgRx State Management

### Action Creators
Use `createAction()` with proper typing and naming.

```typescript
import { createAction, props } from '@ngrx/store';

// Naming pattern: [Feature] Action Description
export const loginRequest = createAction(
  '[Auth] Login Request',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
```

**Pattern**: Request/Success/Failure triplet for async operations.

### Reducer Creation
Keep reducers pure and immutable.

```typescript
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
```

**Why**: Immutability ensures predictable state changes.

### Effects
Handle side effects (HTTP, navigation, notifications).

```typescript
import { createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, finalize } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      tap(() => this.loadingService.show()),
      // switchMap cancels previous requests (best for login)
      switchMap(({ username, password }) =>
        this.http.post<ApiResponse<User>>('/account/sign-in', {
          username,
          password
        }).pipe(
          map(response => AuthActions.loginSuccess({
            user: response.result,
            token: response.result.token
          })),
          catchError(error =>
            of(AuthActions.loginFailure({
              error: error.error?.message || 'Login failed'
            }))
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  // Navigation effect - no dispatch needed
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/']))
    ),
    { dispatch: false } // Required when not returning action
  );
}
```

**Operator Selection**:
- `switchMap()` - Cancel previous requests (login, search)
- `mergeMap()` - Run in parallel (independent operations)
- `concatMap()` - Queue requests in order
- `exhaustMap()` - Ignore new requests while one is pending

### Selectors
Create memoized selectors for state slices.

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

const selectAuthFeature = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.isAuthenticated
);

export const selectToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.token
);

// Combined selectors
export const selectAuthStatus = createSelector(
  selectIsAuthenticated,
  selectUser,
  (isAuthenticated, user) => ({ isAuthenticated, user })
);
```

**Why**: Selectors are memoized, preventing unnecessary component re-renders.

## Service Patterns

### Facade Pattern
Services act as facades over the store.

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private store = inject(Store<{ auth: AuthState }>);

  // Observable selectors for components
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  user$ = this.store.select(selectUser);
  token$ = this.store.select(selectToken);

  // Synchronous getters for guards/interceptors
  getToken(): string | null {
    let token: string | null = null;
    this.token$.pipe(take(1)).subscribe(t => token = t);
    return token;
  }

  getCurrentUser(): User | null {
    let user: User | null = null;
    this.user$.pipe(take(1)).subscribe(u => user = u);
    return user;
  }

  // Action dispatchers
  login(username: string, password: string) {
    this.store.dispatch(AuthActions.loginRequest({ username, password }));
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
```

**Why**: Services provide a clean API, components don't need to know about NgRx.

### State Signals (Alternative)
For simple services, use Angular signals instead of observables.

```typescript
@Injectable({ providedIn: 'root' })
export class SidebarService {
  // Signal for toggle state
  private isOpenSignal = signal(false);

  // Public readonly signal
  isOpen = this.isOpenSignal.asReadonly();

  toggle() {
    this.isOpenSignal.update(val => !val);
  }

  open() {
    this.isOpenSignal.set(true);
  }

  close() {
    this.isOpenSignal.set(false);
  }
}

// In component:
export class HeaderComponent {
  private sidebarService = inject(SidebarService);
  isOpen = this.sidebarService.isOpen;

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}

// In template:
@if (isOpen()) {
  <app-sidebar></app-sidebar>
}
```

## HTTP & Interceptors

### Functional Interceptors
Use functional interceptor pattern (modern Angular).

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const publicEndpoints = [
    '/account/sign-in',
    '/account/sign-up',
    '/account/forgot-password'
  ];

  // Skip adding token for public endpoints
  if (publicEndpoints.some(endpoint => req.url.includes(endpoint))) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

## Template & View Conventions

### Template Syntax
Prefer clear, descriptive templates.

```html
<!-- ✓ Good: Clear structure -->
<div class="quiz-container">
  @if (quizState$ | async as quiz) {
    <h1>{{ quiz.title }}</h1>
    <p>{{ quiz.currentQuestion + 1 }} / {{ quiz.total }}</p>
  }
</div>

<!-- ✗ Avoid: Ambiguous, complex logic -->
<div>{{ (q$ | async)?.title || 'Loading...' }}</div>
```

### Two-Way Binding
Use `ngModel` only for forms. Use `[property]` and `(event)` elsewhere.

```html
<!-- ✓ Form binding -->
<input [(ngModel)]="username" />

<!-- ✓ Component binding -->
<app-flashcard
  [vocabulary]="vocab"
  (cardFlipped)="onFlip($event)"
/>

<!-- ✗ Avoid two-way on components -->
<app-sidebar [(open)]="isSidebarOpen" />
```

## TypeScript Conventions

### Type Definitions
Always define interfaces in `types/index.ts`.

```typescript
// ✓ types/index.ts
export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
}

export interface StudySet {
  id: string;
  title: string;
  vocabularies: Vocabulary[];
}

// ✗ Avoid: Inline types
export type User = { id: string; name: string };
```

### Enum Usage
Use enums for fixed value sets.

```typescript
// ✓ types/enum.ts
export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

// Usage
if (user.role === ROLE.ADMIN) { ... }
```

### Strict Typing
Enable TypeScript strict mode (enabled in tsconfig.json).

```typescript
// ✓ Typed
function updateUser(user: User): User {
  return { ...user, lastLogin: new Date() };
}

// ✗ Avoid any
function updateUser(user: any): any {
  return user;
}
```

## SCSS/CSS Conventions

### Variables
Define all colors and spacing in `src/app/styles/_variables.scss`.

```scss
// _variables.scss
$primary-color: #2a4d7a;
$primary-color-light: #c8dcf7;
$background-dark: #1a2e3f;
$text-light: #ffffff;
$text-muted: #b0c4de;

$sidebar-width: 250px;
$header-height: 70px;

$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

### Component Styles
Keep styles scoped to components using `styleUrl`.

```typescript
@Component({
  selector: 'app-flashcard',
  standalone: true,
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.scss' // Scoped styles
})
export class FlashcardComponent { }
```

### BEM Naming
Use Block-Element-Modifier naming.

```scss
// ✓ BEM pattern
.flashcard {
  &__front {
    background: $primary-color;
  }

  &__back {
    background: $primary-color-light;
  }

  &--flipped {
    transform: rotateY(180deg);
  }
}

// Template
<div
  class="flashcard"
  [ngClass]="{'flashcard--flipped': isFlipped()}"
>
  <div class="flashcard__front">{{ vocab.term }}</div>
  <div class="flashcard__back">{{ vocab.definition }}</div>
</div>
```

### Dark Theme Consistency
All colors must reference SCSS variables.

```scss
// ✓ Using variables
.button {
  background: $primary-color;
  color: $text-light;
}

// ✗ Hardcoded colors
.button {
  background: #2a4d7a;
  color: #ffffff;
}
```

## File Organization

### Imports Order
1. Angular imports
2. Third-party imports
3. Local application imports
4. Relative imports

```typescript
// ✓ Good
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { AppState } from '../../store/app.state';
import { selectAllStudySets } from '../../store/studyset/studyset.selectors';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import { DashboardComponent } from './dashboard.component';
import { LibraryComponent } from './library.component';
```

### Single Responsibility
Each file should have one primary responsibility.

```
✓ Good structure:
  auth/
    auth.actions.ts         (only action creators)
    auth.reducer.ts         (only state mutations)
    auth.effects.ts         (only side effects)
    auth.selectors.ts       (only selectors)
    auth.state.ts           (only state interface)

✗ Avoid:
  auth.ts (all of the above mixed together)
```

## Git Workflow

### Branch Naming
Follow pattern: `category/short-description`

```bash
feat/user-login              # New feature
fix/auth-token-bug           # Bug fix
docs/update-readme           # Documentation
chore/upgrade-dependencies   # Maintenance
```

### Commit Messages
Format: `emoji CATEGORY: message`

```bash
✨ FEAT: Add quiz timer with auto-advance
🐛 FIX: Fix flashcard flip animation delay
🎨 UI: Update dark theme color palette
♻️ REFACTOR: Extract quiz state logic to service
```

## Testing Conventions

### Test File Naming
Test files match component files: `component-name.spec.ts`

### Test Structure
```typescript
describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [MockStore]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
  });

  it('should start quiz when initialized', () => {
    fixture.detectChanges();
    expect(component.currentQuestion).toBeDefined();
  });
});
```

## Documentation Conventions

### Inline Comments
Use comments sparingly, only for complex logic.

```typescript
// ✓ Explains WHY, not WHAT
// switchMap cancels previous login requests if user clicks button again
switchMap(({ username, password }) =>
  this.http.post(...)
)

// ✗ Over-commented
// Create HTTP request with username and password
this.http.post(...)
```

### JSDoc for Public APIs
```typescript
/**
 * Authenticate user with credentials
 * @param username - User's login name
 * @param password - User's password
 * @throws {Error} If credentials are invalid
 */
login(username: string, password: string): void {
  this.store.dispatch(AuthActions.loginRequest({ username, password }));
}
```
