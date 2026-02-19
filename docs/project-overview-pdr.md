# Project Overview & Product Development Requirements

## Executive Summary

QuizCard is a modern web application for learning and mastering vocabulary through interactive flashcards and quizzes. Built with Angular 20.3 and NgRx, it provides a seamless, responsive learning experience with persistent state management and real-time feedback.

## Project Vision

Enable users to efficiently learn new vocabulary through:
1. **Interactive flashcards** with spaced repetition
2. **Timed quizzes** with multiple-choice questions
3. **Progress tracking** with detailed analytics
4. **Customizable study sets** from basic vocabulary to advanced topics

## Target Users

- **Language learners**: Students learning English, Japanese, Vietnamese, etc.
- **Test takers**: TOEIC, IELTS, SAT exam candidates
- **Professional development**: Career-focused professionals expanding vocabulary
- **Educators**: Teachers creating study sets for their students

## Core Features

### Phase 1: MVP (✓ Complete)

#### Authentication
- [x] User sign-in with email/password
- [x] User registration with email verification
- [x] Email verification flow: register → verify-email-sent → verify-email (token-based)
- [x] Auto-login after successful email verification
- [x] JWT token-based authentication (accessToken + refreshToken)
- [x] Persistent login (localStorage)
- [x] Session recovery on app restart
- [x] Resend verification email with cooldown timer

#### Study Sets
- [x] Browse public vocabulary sets
- [x] View set metadata (title, author, creation date)
- [x] Static study set data from fake JS files
- [x] Quick preview of vocabularies

#### Flashcard Mode
- [x] Flip animation with term/definition display
- [x] Keyboard navigation (arrow keys, spacebar)
- [x] Progress indicator (current/total cards)
- [x] Manual shuffle option

#### Quiz Mode
- [x] Multiple-choice questions (4 options)
- [x] 20-second timer per question with visual countdown
- [x] Auto-advance to next question on timeout
- [x] Instant feedback on answer selection
- [x] Skip current question option

#### Quiz Results
- [x] Final score and accuracy percentage
- [x] Time taken for quiz
- [x] Review of wrong answers with correct solutions
- [x] Ability to retake quiz from results screen

### Phase 2-6: Core Features (✓ Complete)

#### User Authentication & Profile
- [x] Forgot password page with reset email
- [x] Reset password with token from email
- [x] User profile page with edit form
- [x] Change password functionality
- [x] User profile updates via API

#### Study Set Management
- [x] Create new study sets with StudySetForm
- [x] Edit existing study sets
- [x] Delete study sets
- [x] Drag-drop term editor with add/remove capability
- [x] Search and filter study sets
- [x] View toggle (grid/list) in library

#### Enhanced Flashcard Mode
- [x] Progress bar showing card position
- [x] Shuffle toggle to randomize order
- [x] Mark-learned feature to track mastery
- [x] Flip order toggle (term-first vs definition-first)
- [x] Text-to-Speech (Web Speech API, SSR-safe)

#### Enhanced Quiz Mode
- [x] Multiple-choice quiz (4 options)
- [x] True/False quiz (2 options)
- [x] Fill-in-the-blank quiz with fuzzy matching
- [x] Timer per question
- [x] Results with accuracy tracking

#### AI Term Generation
- [x] AI Generate page with prompt input
- [x] Language and difficulty level options
- [x] Generated terms display with preview
- [x] Save generated terms as new study set
- [x] AI usage statistics

#### Dashboard Enhancements
- [x] Stats cards showing key metrics
- [x] Quick access to recent study sets
- [x] Sidebar navigation with mobile toggle

### Phase 7: Backend Integration (Planned)

#### REST API Integration
- Replace fake data with real API calls
- Study set CRUD operations via API
- Quiz generation and submission
- User profile API integration

#### Spaced Repetition
- Track vocabulary mastery per user
- SM-2 algorithm implementation
- Optimal review scheduling
- Difficulty ranking per vocabulary item

#### Progress Analytics
- Learning streak tracking
- Time spent per set
- Vocabulary mastery percentage
- Weak area identification

#### Adaptive Learning
- Adjust quiz difficulty based on performance
- Recommend study sets based on learning history
- Personalized learning paths

### Phase 8: Advanced Analytics (Planned)

- Full analytics dashboard with charts
- Progress visualization
- Weekly/monthly learning reports
- Email digest of learning summary

### Phase 9: Platform Enhancement (Planned)

#### Internationalization
- Multi-language UI support (Vietnamese, English, Japanese)
- RTL language support
- Localized date/time formatting

#### Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard-only navigation
- High contrast mode

#### Performance
- Progressive Web App (PWA) support
- Offline mode with service workers
- Image and bundle optimization
- CDN integration

## Technical Requirements

### Functional Requirements

| Requirement | Description | Status |
|-------------|-------------|--------|
| FR-1 | User authentication with JWT | ✓ Done |
| FR-1a | Email verification flow after signup | ✓ Done |
| FR-1b | Resend verification email | ✓ Done |
| FR-1c | Forgot/Reset password flow | ✓ Done |
| FR-2 | View vocabulary study sets | ✓ Done |
| FR-2a | Create/Edit study sets | ✓ Done |
| FR-2b | Search and filter study sets | ✓ Done |
| FR-3 | Flashcard learning mode with TTS | ✓ Done |
| FR-3a | Progress bar and shuffle toggle | ✓ Done |
| FR-3b | Mark-learned and flip order | ✓ Done |
| FR-4 | Multiple quiz types (MC, T/F, Fill) | ✓ Done |
| FR-5 | Quiz result tracking and accuracy | ✓ Done |
| FR-6 | Protected route access control | ✓ Done |
| FR-7 | API integration via HttpClient | ✓ Done |
| FR-8 | Auto-advance quiz questions | ✓ Done |
| FR-9 | User profile management | ✓ Done |
| FR-10 | AI term generation | ✓ Done |

### Non-Functional Requirements

| Requirement | Target | Status |
|-------------|--------|--------|
| NFR-1 | Page load time | < 2 seconds | ✓ Met |
| NFR-2 | Quiz load time | < 1 second | ✓ Met |
| NFR-3 | Quiz timer accuracy | ± 100ms | ✓ Met |
| NFR-4 | SSR support | Full page rendering | ✓ Done |
| NFR-5 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) | ✓ Done |
| NFR-6 | Mobile responsiveness | 360px+ screen width | ✓ Done |
| NFR-7 | State persistence | localStorage with recovery | ✓ Done |
| NFR-8 | Change detection | Zoneless (signal-based) | ✓ Done |

## Architecture Decisions

### State Management: NgRx
**Decision**: Use NgRx for centralized state management

**Rationale**:
- Predictable state mutations via reducers
- Side effect management with Effects
- Time-travel debugging with Store DevTools
- Excellent TypeScript support
- Works seamlessly with Angular 20.3

**Trade-off**: More boilerplate than simple services, but better for scalability

### Storage: localStorage via ngrx-store-localstorage
**Decision**: Persist auth state automatically to browser localStorage

**Rationale**:
- Users stay logged in across sessions
- No manual serialization/deserialization needed
- SSR-safe with type checking
- Conditional sync (only when no errors or loading)

**Trade-off**: Data persisted client-side, requires cleanup strategy

### Styling: SCSS with Dark Theme
**Decision**: Dark theme (#1a2e3f background) with SCSS variables

**Rationale**:
- Reduces eye strain during study sessions
- Modern aesthetic matching current design trends
- SCSS variables enable easy customization
- Componentized SCSS for maintainability

### Component Pattern: Standalone Standalone Components
**Decision**: All components use `standalone: true` without NgModules

**Rationale**:
- Simpler import structure
- Easier code splitting and lazy loading
- Aligns with Angular 14+ best practices
- Reduced bundle size

### Change Detection: Zoneless
**Decision**: Use `provideZonelessChangeDetection()` instead of zone.js

**Rationale**:
- Better performance (no zone monkey-patching)
- Explicit reactivity with signals
- Cleaner mental model
- Smaller bundle footprint

## API Integration

### Current State
- Fake/static data imported from JS files (hiragana.js, kanji.js, toeic*.js)
- StudySetService returns observables wrapping imported data
- No API calls for study set data yet

### Planned Changes
- Replace StudySetService with HTTP calls to backend
- Endpoints: GET /studyset, GET /studyset/:id, POST /studyset (create)
- Implement error handling and loading states
- Add caching strategy for study set data

### API Endpoints (Planned)

```
POST   /account/sign-in          # User authentication
GET    /account/profile          # Get current user
POST   /account/sign-out         # Logout
GET    /studyset                 # List all study sets
GET    /studyset/:id             # Get study set details
POST   /studyset                 # Create new study set
PUT    /studyset/:id             # Update study set
DELETE /studyset/:id             # Delete study set
POST   /quiz/result              # Record quiz result
GET    /user/progress/:userId    # Get learning progress
```

## Success Metrics

### User Engagement
- Daily active users (target: 100+)
- Average session duration (target: 10+ minutes)
- Quiz completion rate (target: 80%+)
- Return user rate (target: 40%+)

### Learning Effectiveness
- Average quiz score improvement after 5 quizzes (target: +15%)
- Vocabulary retention rate at 1-week follow-up (target: 70%+)
- User satisfaction rating (target: 4.2/5.0)

### Technical Performance
- Lighthouse score (target: 90+)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- SSR TTFB < 500ms
- API response time < 200ms (p95)

## Dependencies & Constraints

### Technical Constraints
- Angular 20.3 minimum (locked in package.json)
- TypeScript 5.9+ required
- Node.js 20.x recommended
- Modern browsers only (ES2022+)

### Architectural Constraints
- All UI via PrimeNG components (no custom component library yet)
- Dark theme (#1a2e3f) mandatory
- Vietnamese language strings used throughout
- SSR support required (Express server)

### Timeline Constraints
- Phase 1 (MVP): Complete
- Phase 2: 4 weeks
- Phase 3: 6 weeks
- Phase 4+: TBD

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| API latency > 2s | Medium | High | Implement caching + optimistic updates |
| Token expiration during quiz | Low | Medium | Add token refresh mechanism |
| State bloat over time | Medium | Medium | Implement state cleanup + normalization |
| SSR hydration issues | Low | High | Comprehensive testing on each deployment |
| Mobile UX issues | Medium | Medium | Test on actual devices early and often |

## Definitions

**Study Set**: A collection of vocabulary items grouped by topic (e.g., "TOEIC Vocabulary Part 1")

**Flashcard**: A two-sided card showing term on front, definition on back

**Quiz**: Multiple-choice assessment with automatic scoring and result tracking

**JWT Token**: JSON Web Token used for stateless authentication

**NgRx Store**: Centralized state container for application data

**Effect**: Side effect handler that responds to actions and may dispatch new actions

**Selector**: Memoized function to derive and subscribe to pieces of state
