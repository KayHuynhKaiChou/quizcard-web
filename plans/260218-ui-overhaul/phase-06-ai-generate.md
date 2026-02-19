# Phase 6: AI Generate & Advanced Features

## Context
- **Parent plan**: [plan.md](./plan.md)
- **Dependencies**: Phase 1 (design), Phase 3 (ai-usage-badge), Phase 4 (studyset store CRUD)
- **Docs**: [PRD Section 2.3, 3.x, 4.5](../../docs/requirement.md)

## Overview
- **Date**: 2026-02-18
- **Description**: Build AI vocabulary generation page, AI NgRx store, TTS integration, notifications page
- **Priority**: P1
- **Effort**: 6h
- **Implementation status**: pending
- **Review status**: pending

## Key Insights
- AI generation is the PRD's differentiating feature — prompt → Gemini → terms preview → save as StudySet
- 5 calls/day limit per user, tracked server-side, displayed on frontend
- Generated terms need inline editing before saving (Table with editable cells)
- TTS uses Web Speech API (browser-native, no library needed, SSR-unsafe)
- Notifications page is currently a placeholder — build out with basic UI

## Requirements
1. Create AI NgRx store slice (ai/state, actions, reducer, effects, selectors)
2. Create AI service (HTTP calls to `/api/ai/*` endpoints)
3. Create AI Generate page (prompt form, options, results preview/edit, save)
4. Wire ai-usage-badge component to real AI store data
5. Add TTS to flashcard component (Web Speech API)
6. Build out Notifications page (basic list UI)
7. Add route: `/ai-generate`
8. Add new types: AiUsage, AiGenerateRequest, AiGenerateResponse, GeneratedTerm

## Architecture

### AI Store
```typescript
interface AiState {
  usage: AiUsage | null;        // { date, usageCount, maxUsage, remaining, resetAt }
  generatedTerms: GeneratedTerm[];
  isGenerating: boolean;
  error: string | null;
}
```

### AI Generate Page Flow
```
User opens /ai-generate
    ↓
dispatch loadAiUsage → GET /api/ai/usage
    ↓
Display "Còn X/5 lượt hôm nay"
    ↓
User fills prompt form:
  - Prompt (textarea, required)
  - Word count (InputNumber, 10-100)
  - Source language (Dropdown: en, vi, ja, ko)
  - Target language (Dropdown)
  - Difficulty (Dropdown: beginner, intermediate, advanced)
    ↓
User clicks "Generate" (disabled if remaining=0)
    ↓
dispatch generateTerms(request) → POST /api/ai/generate-terms
    ↓
Show loading spinner during generation
    ↓
Display results in editable PrimeNG Table:
  | # | Term | Definition | IPA | Example | Actions |
  User can edit any cell inline, delete rows
    ↓
User clicks "Lưu thành Study Set"
    ↓
Prompt for study set title/category/visibility
    ↓
dispatch createStudySet (reuse from Phase 4)
    ↓
Navigate to /set/:id
```

### TTS Integration
```typescript
// In flashcard component (browser-only)
speak(text: string, lang: string = 'en'): void {
  if (isPlatformBrowser(this.platformId) && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}
```

## Related Code Files

### Modify
- `src/app/store/app.state.ts` — add `ai: AiState` to AppState
- `src/app/app.config.ts` — register AiEffects, aiReducer
- `src/app/app.routes.ts` — add /ai-generate route
- `src/app/types/index.ts` — add AI types
- `src/app/components/common/ai-usage-badge/ai-usage-badge.ts` — wire to store
- `src/app/components/common/flashcard/flashcard.ts` — add TTS button
- `src/app/components/common/flashcard/flashcard.html` — add speaker icon
- `src/app/pages/notifications/notifications.ts` — build out from placeholder
- `src/app/pages/notifications/notifications.html` — notification list UI
- `src/app/interceptors/auth.interceptor.ts` — no change needed (AI endpoints are protected)

### Create (new files)
- `src/app/store/ai/ai.state.ts`
- `src/app/store/ai/ai.actions.ts`
- `src/app/store/ai/ai.reducer.ts`
- `src/app/store/ai/ai.effects.ts`
- `src/app/store/ai/ai.selectors.ts`
- `src/app/store/ai/index.ts`
- `src/app/services/ai.service.ts`
- `src/app/pages/ai-generate/ai-generate.ts` + `.html` + `.scss`

## Implementation Steps

### Step 1: Add AI types
```typescript
export interface AiUsage {
  date: string; usageCount: number; maxUsage: number;
  remaining: number; resetAt: string;
}
export interface AiGenerateRequest {
  prompt: string; count: number; sourceLanguage: string;
  targetLanguage: string; difficulty: string;
  includeExamples?: boolean; includeIpa?: boolean;
}
export interface GeneratedTerm {
  term: string; definition: string; ipa?: string;
  example?: string; exampleTranslation?: string;
  synonyms?: string[]; category?: string;
}
export interface AiGenerateResponse {
  remainingUsage: number; terms: GeneratedTerm[];
}
```

### Step 2: Create AI NgRx store
Follow auth store pattern:
- Actions: loadAiUsage/Success/Failure, generateTerms/Success/Failure, clearGeneratedTerms, updateGeneratedTerm
- Reducer: handle all actions, track usage + generated terms
- Effects: HTTP calls to `/api/ai/usage`, `/api/ai/generate-terms`
- Selectors: selectAiUsage, selectRemainingUsage, selectGeneratedTerms, selectIsGenerating

### Step 3: Create AI service
```typescript
@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsage(): Observable<AiUsage> {
    return this.http.get<AiUsage>(`${this.apiUrl}/api/ai/usage`);
  }
  generateTerms(request: AiGenerateRequest): Observable<AiGenerateResponse> {
    return this.http.post<AiGenerateResponse>(`${this.apiUrl}/api/ai/generate-terms`, request);
  }
}
```

### Step 4: Create AI Generate page
- Reactive form for prompt options
- PrimeNG: Textarea, InputNumber, Dropdown, Button, Table (editable), Tag, Toolbar
- On init: dispatch loadAiUsage
- Display ai-usage-badge with real data
- Generate button disabled when `remaining === 0`
- Results Table with `editMode="cell"` for inline editing
- Delete row button per row
- "Save as Study Set" button opens dialog for title/category → dispatches createStudySet

### Step 5: Wire ai-usage-badge to store
- Inject Store, select remaining from AI selectors
- Pass to template via async pipe

### Step 6: Add TTS to flashcard
- Add speaker icon button (pi-volume-up)
- On click: call `speak(vocabulary.term, sourceLanguage)`
- Guard with `isPlatformBrowser`
- Show only when browser supports speechSynthesis

### Step 7: Build Notifications page
- Basic list layout with PrimeNG components
- Notification types: review reminder, community actions
- Mark as read functionality
- Empty state when no notifications

### Step 8: Register AI store in app.config
```typescript
provideStore({ auth: authReducer, studySet: studySetReducer, ai: aiReducer }, ...),
provideEffects([AuthEffects, StudySetEffects, AiEffects]),
```

### Step 9: Add route
```typescript
{ path: 'ai-generate', loadComponent: () => import('./pages/ai-generate/ai-generate').then(m => m.AiGeneratePage) },
```

## Todo
- [ ] Add AI types to index.ts
- [ ] Create AI store slice (state, actions, reducer, effects, selectors)
- [ ] Create AI service
- [ ] Register AI store + effects in app.config.ts
- [ ] Create AI Generate page (form, results table, save flow)
- [ ] Wire ai-usage-badge to real store data
- [ ] Add TTS to flashcard (Web Speech API, SSR-safe)
- [ ] Build out Notifications page
- [ ] Add /ai-generate route
- [ ] Test AI generation flow end-to-end
- [ ] Test TTS on different browsers

## Success Criteria
- AI Generate page renders with prompt form and usage badge
- Quota display shows correct remaining count
- Generate button disabled at 0 remaining
- Generated terms display in editable table
- Inline editing works (modify term, definition, delete row)
- "Save as Study Set" creates a new study set with generated terms
- TTS speaks term on flashcard with speaker icon
- Notifications page shows list or empty state

## Security Considerations
- AI API key is ONLY on backend — frontend never sees it
- AI requests authenticated via JWT (auth interceptor handles this)
- Rate limiting enforced server-side (5/day), frontend shows remaining

## Risk Assessment
| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Backend AI API not ready | High | Mock response in effects for UI testing |
| Web Speech API voice quality varies | Medium | Show "TTS not supported" fallback |
| PrimeNG Table editMode SSR issue | Low | Guard with isPlatformBrowser |

## Next Steps
After all 6 phases complete:
- Integration testing across all pages
- Performance audit (bundle size, lazy loading)
- Update CLAUDE.md and docs/ to reflect new architecture
