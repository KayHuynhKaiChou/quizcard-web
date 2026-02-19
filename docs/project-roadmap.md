# Project Roadmap

## Current Status: Phases 1-6 Complete (MVP + Core Features)

**Latest Phase Completion**: Phase 6 (AI Generate + TTS)
**Overall Completion**: February 19, 2025
**Build Status**: Stable
**Users**: Internal Testing

## Phase 1: MVP (Complete)

### Core Features Delivered

#### Authentication
- [x] User sign-in with username/password
- [x] JWT token storage and management
- [x] Protected route access via AuthGuard
- [x] Persistent login via localStorage
- [x] Session recovery on app restart

#### Study Sets & Learning
- [x] Browse public vocabulary study sets
- [x] View study set details (title, author, vocabulary count)
- [x] Static study set data (fake data from JS files)
- [x] Search/filter study sets (basic)

#### Flashcard Learning
- [x] Interactive flashcard component with flip animation
- [x] Term/definition display
- [x] Keyboard navigation (arrow keys, spacebar)
- [x] Progress indicator (current/total cards)
- [x] Manual shuffle of cards

#### Quiz Mode
- [x] Multiple-choice quiz questions (4 options)
- [x] 20-second timer per question with countdown
- [x] Auto-advance to next question on timeout
- [x] Instant feedback on answer selection
- [x] Skip question functionality

#### Quiz Results
- [x] Final score display
- [x] Accuracy percentage calculation
- [x] Time taken tracking
- [x] Review wrong answers with correct solutions
- [x] Retake quiz from results screen

#### User Interface
- [x] Dark theme (#1a2e3f background)
- [x] PrimeNG Aura theme integration
- [x] Responsive design (mobile-friendly)
- [x] Global loading overlay
- [x] Header with user menu
- [x] Sidebar navigation

#### Technical Foundation
- [x] Angular 20.3 with standalone components
- [x] Zoneless change detection
- [x] NgRx state management (auth, studyset)
- [x] localStorage persistence via ngrx-store-localstorage
- [x] HTTP interceptor for auth headers
- [x] Route guards and lazy loading
- [x] SSR support with Express
- [x] Store DevTools for debugging
- [x] Karma/Jasmine test setup

### Phase 1 Metrics

| Metric | Status |
|--------|--------|
| Core pages | 6/6 complete |
| NgRx features | 2/2 implemented |
| API integration | 1/3 endpoints |
| Test coverage | 40% (basic tests) |
| Lighthouse score | 85+ |
| Mobile support | iOS/Android tested |

---

## Phase 2: Authentication Pages (Complete)

### Completed Q1 2025 - Auth Flow Pages

#### Features Delivered
- [x] Forgot Password page (`/forgot-password`) - Request password reset email
- [x] Reset Password page (`/reset-password`) - Set new password with token
- [x] Verify Email page (`/verify-email`) - Auto-verify with token from URL
- [x] Verify Email Sent page (`/verify-email-sent`) - Pending verification with resend option
- [x] Signup page (`/signup`) - User registration with email verification flow
- [x] Enhanced auth store with password reset actions/reducer/effects
- [x] Email verification flow with auto-redirect on success

---

## Phase 3: Dashboard + Components + Sidebar (Complete)

### Completed Q1 2025 - Shared Components & Enhanced UI

#### Shared Components Delivered
- [x] SearchToolbar component - Search and filter functionality
- [x] ViewToggle component - Switch between grid/list views
- [x] StatsCard component - Display statistics with icons
- [x] EmptyState component - Show when no results found
- [x] AiUsageBadge component - Display AI feature usage

#### Dashboard Redesign
- [x] Dashboard page with stats cards layout
- [x] Quick access to study sets and recent quizzes
- [x] Sidebar navigation with link highlighting
- [x] Responsive sidebar (mobile-friendly toggle)

---

## Phase 4: Study Set CRUD + Enhanced Library (Complete)

### Completed Q1 2025 - Create & Edit Study Sets

#### Study Set Management
- [x] Create Study Set page (`/create-set`) with StudySetForm
- [x] Edit Study Set page (`/set/:id/edit`) with StudySetForm
- [x] StudySetForm reusable component for create/edit
- [x] TermEditor component with drag-drop support
- [x] Enhanced Library page with:
  - [x] Search by title/description
  - [x] View toggle (grid/list)
  - [x] Skeleton loaders for loading state
  - [x] Empty state display

#### NgRx Store Updates
- [x] Study set CRUD actions (create, update, delete)
- [x] Enhanced reducers and effects for API integration
- [x] Selectors for study set operations

---

## Phase 5a: Flashcard Improvements (Complete)

### Completed Q1 2025 - Enhanced Flashcard Experience

#### Features Delivered
- [x] ProgressBar component showing current card position
- [x] Shuffle toggle to randomize card order
- [x] Mark-learned feature to track mastery
- [x] Flip order toggle (term-first vs definition-first display)
- [x] Improved flashcard animations and UX

---

## Phase 5b: Quiz Enhancement + Profile (Complete)

### Completed Q1 2025 - Quiz Types & User Profile

#### Quiz Modes
- [x] Multiple Choice quiz (4 options per question)
- [x] True/False quiz (2 options per question)
- [x] Fill-in-the-blank quiz with fuzzy matching
- [x] Timer per question with countdown
- [x] Results page with score and accuracy

#### User Profile
- [x] Profile page (`/profile`) showing user information
- [x] Edit profile form (update name, avatar, bio)
- [x] Change password functionality
- [x] Password validation and confirmation

#### NgRx Store Updates
- [x] Auth store with updateProfile actions/reducer/effects
- [x] Quiz store for managing quiz state

---

## Phase 6: AI Generate + Text-to-Speech (Complete)

### Completed Q1 2025 - AI Features & Accessibility

#### AI Term Generation
- [x] AI Generate page (`/ai-generate`) with prompt form
- [x] Language and difficulty level options
- [x] Generated terms display with preview
- [x] Save as study set functionality
- [x] AI store (state, actions, reducer, effects, selectors)

#### Text-to-Speech
- [x] TTS on flashcard component (Web Speech API)
- [x] SSR-safe implementation (checks for browser context)
- [x] Play button with visual feedback
- [x] Support for multiple languages
- [x] Configurable speech rate and pitch

---

## Phase 7: Backend Integration (Planned - 4 weeks)

### Q2 2025 - Real API Integration

#### Study Set Management API
- [ ] GET `/api/study-sets` - List all study sets with pagination
- [ ] GET `/api/study-sets/:id` - Get single study set details
- [ ] POST `/api/study-sets` - Create new study set (authenticated)
- [ ] PUT `/api/study-sets/:id` - Update study set (owner only)
- [ ] DELETE `/api/study-sets/:id` - Delete study set (owner only)
- [ ] POST `/api/study-sets/:id/clone` - Clone existing study set

#### User Endpoints
- [ ] GET `/api/users/me` - Get current user profile
- [ ] PUT `/api/users/me` - Update current user profile

#### Quiz Endpoints
- [ ] POST `/api/quiz/generate` - Generate quiz for study set
- [ ] POST `/api/quiz/submit` - Submit quiz answers
- [ ] GET `/api/quiz/history` - Get quiz history with statistics

#### Implementation Tasks
- [ ] Replace StudySetService fake data with HTTP calls
- [ ] Implement error handling and loading states
- [ ] Add cache strategy for study sets (5-min TTL)
- [ ] Handle pagination in library grid
- [ ] API response typing (ensure match with StudySet interface)
- [ ] Implement search debouncing
- [ ] Add retry logic for failed requests

#### Feature Flags
- [ ] `useRealApi` flag to toggle between fake/real data
- [ ] Gradual rollout of API endpoints

---

## Phase 8: Advanced Learning Features (Planned - 8 weeks)

### Q2-Q3 2025 - Analytics & Spaced Repetition

#### Spaced Repetition Algorithm
- [ ] Track vocabulary mastery per user
- [ ] SM-2 algorithm implementation
- [ ] Optimal review scheduling
- [ ] Difficulty rating per vocabulary item
- [ ] Customizable review intervals

#### Progress Analytics
- [ ] Learning streak tracking (consecutive days)
- [ ] Time spent per study set
- [ ] Vocabulary mastery percentage
- [ ] Weak area identification
- [ ] Performance trends (chart visualization)

#### Quiz Enhancement
- [ ] Adaptive difficulty based on performance
- [ ] Question selection by weakness
- [ ] Personalized study recommendations
- [ ] Quiz statistics (average score, success rate)

#### User Progress Endpoints
```
GET /api/learning/today               Get today's review schedule
POST /api/learning/submit             Submit review result
GET /api/learning/stats               Get learning statistics
```

#### Implementation Tasks
- [ ] Create `learning` NgRx feature (if not already done)
- [ ] Implement SM-2 algorithm in service
- [ ] Progress dashboard page with charts
- [ ] Weekly/monthly reports
- [ ] Email digest of learning summary

---

## Phase 9: Platform Enhancement (Planned - Ongoing)

### Q1 2026 - UX/Performance Polish

#### Internationalization (i18n)
- [ ] Vietnamese UI labels (partially done)
- [ ] English UI labels
- [ ] Japanese UI labels (for TOEIC sets)
- [ ] Language switcher in settings
- [ ] Locale-aware date/time formatting
- [ ] RTL support (future)

#### Accessibility (a11y)
- [ ] WCAG 2.1 AA compliance audit
- [ ] Screen reader testing (NVDA, JAWS)
- [ ] Keyboard-only navigation (no mouse required)
- [ ] High contrast mode toggle
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Color blindness support

#### Performance
- [ ] Progressive Web App (PWA) support
  - [ ] Service worker for offline mode
  - [ ] Install to home screen
  - [ ] App shell caching strategy
- [ ] Image optimization (lazy loading, WebP)
- [ ] Bundle size reduction (current: ~500KB)
- [ ] Code splitting improvements
- [ ] Lighthouse score target: 95+

#### Community Features
- [ ] User profiles with avatar upload
- [ ] Study set ratings and reviews
- [ ] Comments on study sets
- [ ] Follower system
- [ ] Trending study sets
- [ ] Share to social media

#### Implementation Tasks
- [ ] i18n setup with ngx-translate (or Angular i18n)
- [ ] Accessibility audit via axe-core
- [ ] PWA manifest and service worker
- [ ] CDN setup for static assets
- [ ] Image optimization pipeline
- [ ] Performance monitoring (Sentry)

---

## Technical Debt & Maintenance

### Current Items

| Item | Priority | Effort | Status |
|------|----------|--------|--------|
| Unit test coverage → 80% | Medium | 3 weeks | Not started |
| E2E tests with Cypress | Medium | 2 weeks | Not started |
| API error handling standardization | Medium | 1 week | Partial |
| State normalization for large datasets | Low | 2 weeks | Design phase |
| Documentation updates | High | Ongoing | In progress |
| Dependency security audit | High | 1 week | Quarterly |

### Dependency Updates
- [ ] Angular 21 migration (Q2 2026)
- [ ] PrimeNG 21 migration (Q2 2026)
- [ ] RxJS 8 evaluation (Q3 2026)
- [ ] Node 22 LTS support (Q4 2026)

---

## Completed Features & Achievements

### Phase 1-6 Delivered
1. ✓ **Complete Authentication Flow** - Sign in, register, email verification, password reset
2. ✓ **Study Set Management** - Create, read, update, delete study sets
3. ✓ **Enhanced Flashcard Mode** - Progress bar, shuffle, mark-learned, flip order
4. ✓ **Multiple Quiz Types** - Multiple Choice, True/False, Fill-in-the-blank
5. ✓ **User Profile Management** - Edit profile, change password, view stats
6. ✓ **AI Term Generation** - Generate vocabulary with AI, save as study sets
7. ✓ **Text-to-Speech** - Pronounce terms using Web Speech API (SSR-safe)
8. ✓ **Responsive UI** - Dashboard with stats, library with search, sidebar navigation
9. ✓ **NgRx State Management** - 7 feature modules (auth, studyset, ai, quiz, learning, explore, notification)

### Known Limitations & Future Work

| Limitation | Target Phase | Reason |
|-----------|-------------|--------|
| Fake data only | Phase 7 | Replace with real backend API calls |
| No analytics dashboard | Phase 8 | Requires progress tracking infrastructure |
| Single language (Vietnamese) | Phase 9 | i18n setup needed |
| No offline support | Phase 9 | PWA/service worker implementation |
| No social features | Phase 9 | Community ratings, comments, followers |

---

## Success Metrics

### Phase-by-Phase KPIs

#### Phase 2 (Backend Integration)
- [ ] 100% study set data via API
- [ ] API response time < 200ms (p95)
- [ ] Zero data loss during migration
- [ ] Zero breaking changes to UI

#### Phase 3 (User Content)
- [ ] 20+ user-created study sets in beta
- [ ] CSV import success rate > 99%
- [ ] Avg 3+ studies sets per user
- [ ] Time to create study set < 5 minutes

#### Phase 4 (Advanced Features)
- [ ] User engagement increase by 40%
- [ ] Vocabulary retention at 1-week > 70%
- [ ] Quiz completion rate > 80%
- [ ] Return user rate > 50%

#### Phase 5 (Platform Polish)
- [ ] WCAG 2.1 AA passed audit
- [ ] Lighthouse score >= 95
- [ ] PWA installable on all platforms
- [ ] i18n support for 3+ languages
- [ ] 10K monthly active users

---

## Release Schedule

| Phase | Start | End | Status |
|-------|-------|-----|--------|
| Phase 1 (MVP) | Oct 2024 | Feb 2025 | ✓ Complete |
| Phase 2 (Auth Pages) | Jan 2025 | Feb 2025 | ✓ Complete |
| Phase 3 (Dashboard + Components) | Jan 2025 | Feb 2025 | ✓ Complete |
| Phase 4 (Study Set CRUD) | Jan 2025 | Feb 2025 | ✓ Complete |
| Phase 5a (Flashcard Improvements) | Jan 2025 | Feb 2025 | ✓ Complete |
| Phase 5b (Quiz + Profile) | Jan 2025 | Feb 2025 | ✓ Complete |
| Phase 6 (AI Generate + TTS) | Jan 2025 | Feb 2025 | ✓ Complete |
| Phase 7 (Backend Integration) | Mar 2025 | May 2025 | Planned |
| Phase 8 (Analytics) | Jun 2025 | Sep 2025 | Planned |
| Phase 9 (Polish) | Oct 2025 | Dec 2025 | Planned |

---

## Open Questions & Decisions Needed

1. **Data Ownership**: Should users only see their own study sets or all public sets?
   - Current: All public sets visible to everyone
   - Future: Add private/shared visibility control

2. **Quiz Difficulty**: Fixed 20 seconds per question or adaptive?
   - Current: Fixed 20s
   - Phase 4: Adaptive timer based on difficulty

3. **Vocabulary Export**: Allow users to export study sets (PDF, Anki format)?
   - Not yet prioritized
   - Depends on community feedback

4. **AI Integration**: Auto-generate example sentences or definitions?
   - Nice-to-have
   - Pending API cost analysis

5. **Mobile App**: Native iOS/Android apps or stay PWA?
   - PWA (Phase 5) first
   - Native apps if 10K+ users reached

---

## Budget & Resource Allocation

### Development Team

| Phase | Frontend (weeks) | Backend (weeks) | Total |
|-------|------------------|-----------------|-------|
| Phase 2 | 2 | 3 | 5 weeks |
| Phase 3 | 3 | 2 | 5 weeks |
| Phase 4 | 2 | 3 | 5 weeks |
| Phase 5 | 2 | 1 | 3 weeks |

### Estimated Costs
- Backend infrastructure: $500/month
- CDN/static assets: $50/month
- Monitoring/logging: $100/month
- Domain/SSL: $20/month

---

## Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Scope creep | High | Medium | Strict phase gating |
| API delays | Medium | High | Parallel client dev, mock API |
| Data migration issues | Low | Critical | Comprehensive test plan |
| Performance degradation | Medium | Medium | Monitoring + optimization |
| User engagement low | Medium | High | UX research + A/B testing |

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| Feb 18, 2025 | 1.0 | Initial roadmap document |
| TBD | 1.1 | Phase 2 detailed planning |
| TBD | 2.0 | Mid-year review and adjustments |
