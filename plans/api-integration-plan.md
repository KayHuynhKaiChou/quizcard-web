# API Integration Plan: Angular Frontend ↔ Java Backend

## Overview
Integrate all 30 REST API endpoints from the Java Spring Boot backend into the Angular 20 frontend. Replace all mock data with real API calls.

---

## Phase 1: Foundation (Types, Environment, Interceptor)

### 1.1 Rewrite `src/app/types/enum.ts`
- Remove all irrelevant enums (PROJECT_STATUS, TASK_STATUS, etc.)
- Add: `Role` (USER, ADMIN), `Visibility` (PUBLIC, PRIVATE, SHARED), `ProgressStatus` (NEW, LEARNING, MASTERED)

### 1.2 Rewrite `src/app/types/index.ts`
Replace all models to match Java backend DTOs:

**Auth DTOs:**
- `LoginRequest` { email, password }
- `RegisterRequest` { email, password, displayName }
- `AuthResponse` { accessToken, refreshToken, expiresIn, tokenType }
- `RefreshTokenRequest` { refreshToken }
- `ForgotPasswordRequest` { email }
- `ResetPasswordRequest` { token, newPassword }
- `ChangePasswordRequest` { oldPassword, newPassword }
- `MessageResponse` { message }

**User DTOs:**
- `User` { id, email, displayName, avatarUrl, bio, role, streakCount, xpPoints, createdAt }
- `UpdateProfileRequest` { displayName?, bio?, avatarUrl? }

**StudySet DTOs:**
- `StudySet` { id, userId, title, description, sourceLanguage, targetLanguage, category, tags, visibility, termsCount, cloneCount, ratingAvg, createdAt, updatedAt }
- `StudySetDetail` extends StudySet + { terms: Term[] }
- `CreateStudySetRequest` { title, description?, sourceLanguage?, targetLanguage?, category?, tags?, visibility?, terms? }
- `UpdateStudySetRequest` { title?, description?, sourceLanguage?, targetLanguage?, category?, tags?, visibility? }

**Term DTOs:**
- `Term` { id, term, definition, ipa, exampleSentence, exampleTranslation, imageUrl, audioUrl, synonyms, antonyms, orderIndex }
- `CreateTermRequest` { term, definition, ipa?, exampleSentence?, exampleTranslation?, imageUrl?, audioUrl?, synonyms?, antonyms? }
- `UpdateTermRequest` - same as Create but all optional

**Quiz DTOs:**
- `QuizConfigRequest` { studySetId, questionCount?, quizType?, timeLimitSeconds? }
- `QuizSubmitRequest` { studySetId, quizType?, timeSpentSeconds?, answers: QuizAnswer[] }
- `QuizAnswer` { termId, userAnswer, correctAnswer, correct }
- `QuizResult` { id, userId, studySetId, quizType, totalQuestions, correctAnswers, score, timeSpentSeconds, details, createdAt }

**Learning DTOs:**
- `ReviewRequest` { termId, quality }
- `LearningStats` (from Map response)

**AI DTOs:**
- `AiGenerateRequest` { prompt, count?, sourceLanguage?, targetLanguage?, difficulty?, includeExamples?, includeIpa? }
- `AiExtractRequest` { text, sourceLanguage?, targetLanguage? }
- `AiGenerateResponse` { remainingUsage, terms: AiTermResponse[] }
- `AiTermResponse` { term, definition, ipa?, example?, exampleTranslation?, synonyms, category? }
- `AiUsageResponse` { date, usageCount, maxUsage, remaining, resetAt }

**Notification DTO:**
- `Notification` { id, userId, type, title, message, read, referenceId, createdAt }

**Shared:**
- `Page<T>` { content: T[], totalElements, totalPages, size, number }
- Remove `ApiResponse<T>` wrapper (backend doesn't use it)

### 1.3 Update `src/environments/environment.ts`
- Change `apiUrl` to `http://localhost:8080/api`

### 1.4 Update `src/app/interceptors/auth.interceptor.ts`
- Update public URLs: `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/verify-email`, `/api/auth/resend-verification`, `/api/auth/reset-password`, `/api/auth/refresh`, `/api/explore/`

---

## Phase 2: Auth Store Overhaul

### 2.1 Update `src/app/store/auth/auth.state.ts`
- Add `refreshToken: string | null` to AuthState

### 2.2 Update `src/app/store/auth/auth.actions.ts`
- Fix `loginRequest` props: `{ email, password }` instead of `{ username, password }`
- Fix `loginSuccess` props: `{ user: User, accessToken: string, refreshToken: string }`
- Add: `registerRequest`, `registerSuccess`, `registerFailure`
- Add: `refreshToken`, `refreshTokenSuccess`, `refreshTokenFailure`
- Add: `forgotPassword`, `resetPassword` actions
- Update `logout` to send refreshToken to backend

### 2.3 Update `src/app/store/auth/auth.reducer.ts`
- Handle new actions, store refreshToken

### 2.4 Update `src/app/store/auth/auth.effects.ts`
- Fix login: `POST /api/auth/login` with `{ email, password }` → `AuthResponse`
- Fix profile: `GET /api/users/me` → `User`
- Add register: `POST /api/auth/register` → `MessageResponse`
- Add logout API: `POST /api/auth/logout` with refreshToken
- Add refresh: `POST /api/auth/refresh` with refreshToken → `AuthResponse`
- Add forgot/reset password effects

### 2.5 Update `src/app/store/auth/auth.selectors.ts`
- Fix `selectUserName`: `user?.displayName` instead of `user?.fullname`
- Add `selectRefreshToken`

### 2.6 Update `src/app/services/auth.service.ts`
- Fix `LoginRequest`: `{ email, password }` instead of `{ username, password }`
- Add `register()`, `forgotPassword()`, `resetPassword()`, `changePassword()` methods
- Add `getRefreshToken()` synchronous getter

---

## Phase 3: StudySet Service & Store Overhaul

### 3.1 Rewrite `src/app/services/studyset.service.ts`
- Remove all fake data imports
- Inject `HttpClient`
- Add HTTP methods:
  - `getMyStudySets(page, size): Observable<Page<StudySet>>`
  - `getStudySetById(id): Observable<StudySetDetail>`
  - `createStudySet(data): Observable<StudySetDetail>`
  - `updateStudySet(id, data): Observable<StudySetDetail>`
  - `deleteStudySet(id): Observable<void>`
  - `cloneStudySet(id): Observable<StudySetDetail>`
  - `addTerm(studySetId, data): Observable<Term>`
  - `updateTerm(id, data): Observable<Term>`
  - `deleteTerm(id): Observable<void>`

### 3.2 Update `src/app/store/studyset/studyset.state.ts`
- Use new `StudySet` and `StudySetDetail` types
- Add pagination state: `page`, `totalPages`, `totalElements`

### 3.3 Update `src/app/store/studyset/studyset.actions.ts`
- Update existing load actions for new types
- Add: `createStudySet`, `updateStudySet`, `deleteStudySet`, `cloneStudySet` actions
- Add: `addTerm`, `updateTerm`, `deleteTerm` actions
- Add pagination params to loadStudySets

### 3.4 Update `src/app/store/studyset/studyset.reducer.ts`
- Handle all new CRUD actions
- Handle pagination state

### 3.5 Update `src/app/store/studyset/studyset.effects.ts`
- Replace mock service calls with real HTTP service calls
- Add effects for create, update, delete, clone
- Add effects for term CRUD
- Add navigation/toast effects

### 3.6 Update `src/app/store/studyset/studyset.selectors.ts`
- Adapt to new model fields

---

## Phase 4: New Feature Stores

### 4.1 Create `src/app/store/notification/`
- `notification.state.ts` - notifications list, pagination, unreadCount
- `notification.actions.ts` - load, markAsRead
- `notification.reducer.ts`
- `notification.effects.ts` - `GET /api/notifications`, `PUT /api/notifications/{id}/read`
- `notification.selectors.ts`

### 4.2 Create `src/app/store/quiz/`
- `quiz.state.ts` - quiz questions, history, current quiz state
- `quiz.actions.ts` - generateQuiz, submitQuiz, loadHistory
- `quiz.reducer.ts`
- `quiz.effects.ts` - `POST /api/quiz/generate`, `POST /api/quiz/submit`, `GET /api/quiz/history`
- `quiz.selectors.ts`

### 4.3 Create `src/app/store/learning/`
- `learning.state.ts` - todayReview, stats
- `learning.actions.ts` - loadTodayReview, submitReview, loadStats
- `learning.reducer.ts`
- `learning.effects.ts` - `GET /api/learning/today`, `POST /api/learning/review`, `GET /api/learning/stats`
- `learning.selectors.ts`

### 4.4 Create `src/app/store/explore/`
- `explore.state.ts` - trending, searchResults, categories
- `explore.actions.ts` - loadTrending, search, loadCategories
- `explore.reducer.ts`
- `explore.effects.ts` - `GET /api/explore/trending`, `GET /api/explore/search`, `GET /api/explore/categories`
- `explore.selectors.ts`

### 4.5 Create `src/app/store/ai/`
- `ai.state.ts` - usage, generatedTerms
- `ai.actions.ts` - getUsage, generateTerms, extractFromText
- `ai.reducer.ts`
- `ai.effects.ts` - `GET /api/ai/usage`, `POST /api/ai/generate-terms`, `POST /api/ai/extract-from-text`
- `ai.selectors.ts`

### 4.6 Register new stores
- Update `src/app/store/app.state.ts` - add all new feature states
- Update `src/app/app.config.ts` - register all new reducers and effects

---

## Phase 5: New Services (Store Facades)

### 5.1 Create `src/app/services/notification.service.ts`
- Facade: dispatch actions, expose selectors as observables

### 5.2 Create `src/app/services/quiz.service.ts`
- HTTP methods for quiz API calls (used by effects)

### 5.3 Create `src/app/services/learning.service.ts`
- HTTP methods for learning API calls (used by effects)

### 5.4 Create `src/app/services/explore.service.ts`
- HTTP methods for explore API calls (used by effects)

### 5.5 Create `src/app/services/ai.service.ts`
- HTTP methods for AI API calls (used by effects)

---

## Phase 6: Update Existing Components

### 6.1 Update `src/app/pages/signin/signin.ts`
- Change form field from `username` to `email`
- Update template accordingly

### 6.2 Update `src/app/pages/dashboard/dashboard.ts`
- Replace hardcoded cards with real data from explore/trending or user's recent sets
- Dispatch `loadStudySets` on init

### 6.3 Update `src/app/pages/library/library.ts`
- Works with new StudySet type (minimal changes needed)

### 6.4 Update `src/app/pages/studyset-detail/studyset-detail.ts`
- Use `StudySetDetail` type with `terms` instead of `vocabularies`
- Update template references

### 6.5 Update `src/app/pages/quiz/quiz.ts`
- Use `Term` instead of `Vocabulary`
- Integrate quiz generation with backend API (optional, can keep client-side quiz logic)

### 6.6 Update `src/app/pages/notifications/notifications.ts`
- Dispatch load notifications
- Display real notification data

### 6.7 Update templates
- `signin.html` - email field
- `studyset-detail.html` - terms instead of vocabularies
- `library.html` - adapt to new StudySet fields
- `dashboard.html` - real data

---

## Phase 7: localStorage Sync Update
- Update `localStorageSyncReducer` in `app.config.ts` to persist `auth` with refreshToken

---

## File Summary

| Action | Files |
|--------|-------|
| **Rewrite** | types/enum.ts, types/index.ts, services/studyset.service.ts |
| **Update** | environment.ts, auth.interceptor.ts, all auth store files (6), all studyset store files (5), app.config.ts, app.state.ts, signin.ts, dashboard.ts, studyset-detail.ts, quiz.ts, notifications.ts, library.ts + their templates |
| **Create** | 5 new store folders (25 files), 4 new services |
| **Delete** | All fakeData/*.js files (no longer needed) |

**Total: ~45 files to create/modify**
