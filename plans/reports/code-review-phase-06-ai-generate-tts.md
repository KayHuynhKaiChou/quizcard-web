# Code Review Report - Phase 6: AI Generate + TTS + Previous Phases

**Reviewer**: Code Reviewer Agent
**Date**: 2026-02-19
**Scope**: Phase 6 (AI Generate page, TTS), plus Quiz, Profile, StudySet CRUD, Library from earlier phases

---

## Code Review Summary

### Scope
- **Files reviewed**: 15 component/template/style files + 8 store/type/config support files
- **LOC**: ~1,200 lines across reviewed files
- **Focus**: Phase 6 new files + previous phase files from same session
- **Scout findings**: Signal/ngModel mismatch, *ngIf legacy usage, self-closing native HTML, input sanitization gaps

### Overall Assessment

The codebase demonstrates solid Angular 20 architecture with proper NgRx patterns, clean store separation, and good SSR awareness. The AI store slice, effects, and reducers are well-structured. However, there are **two critical signal-vs-ngModel compatibility bugs** that will cause runtime failures, plus several high-priority issues around legacy template syntax and missing error display.

---

## Critical Issues

### C1. Signal + ngModel two-way binding mismatch (ai-generate.ts + quiz.ts)

**Files**:
- `src/app/pages/ai-generate/ai-generate.html` line 98
- `src/app/pages/quiz/quiz.html` lines 14, 123

**Problem**: `[(ngModel)]` is used with Angular `signal()` properties. `ngModel` expects a plain property for two-way binding (`[(ngModel)]="prop"` desugars to `[ngModel]="prop" (ngModelChange)="prop=$event"`). Signals are not plain properties - they are getter functions. Writing to a signal requires `.set()`, but `ngModel` will try to assign directly.

In `ai-generate.html`:
```html
<!-- saveTitle is a signal(). ngModel cannot write to it -->
[(ngModel)]="saveTitle"
```
Then on line 102: `!saveTitle().trim()` -- calling it as a signal function.

In `quiz.html`:
```html
<!-- questionCount is a signal(). ngModel cannot write to it -->
[(ngModel)]="questionCount"
<!-- fillBlankAnswer is also a signal -->
[(ngModel)]="fillBlankAnswer"
```
Then on line 18: `{{ questionCount() }}` -- calling it as signal.

**Impact**: Runtime failure. Slider changes won't update the signal. The save title input won't update the signal. Fill-blank answers won't register. These are core user interactions.

**Fix options**:
1. Convert these to plain properties instead of signals:
```typescript
// In ai-generate.ts
saveTitle = '';  // not signal('')

// In quiz.ts
questionCount = 10;  // not signal(10)
fillBlankAnswer = '';  // not signal('')
```
2. Or use manual event binding with signal.set():
```html
[ngModel]="saveTitle()" (ngModelChange)="saveTitle.set($event)"
```

### C2. Self-closing `<input />` and `<p-message />` in templates

**Files**:
- `src/app/pages/profile/profile.html` line 28, 35, 59
- `src/app/pages/ai-generate/ai-generate.html` line 27, 100

**Problem**: Native HTML elements like `<input />` are self-closed. The user's review checklist explicitly states "No self-closing native HTML elements." While Angular's compiler tolerates self-closing `<input />`, this violates the project convention. The `<p-message ... />` on lines 35 and 59 of profile.html are Angular components (self-closing is fine for components), so those are acceptable.

However, the self-closing `<input />` tags at profile.html:28 and ai-generate.html:27,100 should use `<input ... >` (no trailing slash).

**Impact**: Convention violation. Low runtime risk but should be consistent.

---

## High Priority

### H1. Legacy `*ngIf` directive used instead of `@if` control flow

**File**: `src/app/pages/profile/profile.html` line 1

```html
<div class="profile-page" *ngIf="user">
```

**Problem**: Code standards mandate `@if` / `@for` template control flow (Angular 17+). This file uses legacy `*ngIf` structural directive. All other reviewed files correctly use `@if`.

**Fix**:
```html
@if (user) {
<div class="profile-page">
  ...
</div>
}
```

### H2. AI Generate page shows no error state to user

**File**: `src/app/pages/ai-generate/ai-generate.ts`

**Problem**: The component subscribes to `AiSelectors.selectIsLoading` but never subscribes to `AiSelectors.selectError`. If AI generation fails (quota exceeded, server error, network failure), the user sees nothing -- the loading stops but no error message appears. The effects do fire a toast via `MessageService`, but the component has no inline error display and no way to recover.

**Impact**: Poor UX on failure. User clicks "Generate" and nothing happens with no feedback (beyond a toast that may be missed).

**Fix**: Subscribe to `selectError` and display it inline:
```typescript
error = signal<string | null>(null);

// In ngOnInit:
this.sub.add(
  this.store.select(AiSelectors.selectError).subscribe(e => this.error.set(e))
);
```
```html
@if (error()) {
  <div class="error-message">{{ error() }}</div>
}
```

### H3. Quiz timer subscription leak on rapid startTimer calls

**File**: `src/app/pages/quiz/quiz.ts` lines 147-157

**Problem**: `startTimer()` creates a new `interval(1000)` subscription and stores it in `this.timerSubscription`. It calls `stopTimer()` first only in the `nextQuestion()` path (line 219), but `startTimer()` itself does not call `stopTimer()` before creating a new subscription. If `startTimer()` is ever called twice without `stopTimer()` in between (e.g., due to race conditions in the setTimeout on line 193-194), the previous interval keeps running.

```typescript
private startTimer(): void {
  this.timeLeft.set(...);
  // Missing: this.stopTimer(); before creating new subscription
  this.timerSubscription = interval(1000).subscribe(() => { ... });
}
```

**Impact**: Timer drift, multiple simultaneous timers decrementing time faster than expected.

**Fix**: Add `this.stopTimer()` at the start of `startTimer()`:
```typescript
private startTimer(): void {
  this.stopTimer(); // Cancel any existing timer
  this.timeLeft.set(this.selectedType() === 'fill_blank' ? 30 : this.timePerQuestion);
  this.timerSubscription = interval(1000).subscribe(() => { ... });
}
```

### H4. TTS `isSpeaking` signal shared between front and back faces

**File**: `src/app/components/common/flashcard/flashcard.ts`

**Problem**: Both front and back faces of the flashcard share the same `isSpeaking` signal. If TTS is triggered on the front face, then the card is flipped, the back face button also shows the spinning state. More importantly, `window.speechSynthesis.cancel()` is called at the start of `speak()`, but the `onend` callback from the cancelled utterance will fire and set `isSpeaking` to `false`, potentially causing a brief flash.

**Impact**: Minor visual glitch. The speaking indicator may be inaccurate across card faces.

**Fix**: Either track which face is speaking, or accept this as a minor cosmetic issue since only one face is visible at a time due to backface-visibility hidden.

### H5. Profile page `profileSaved` signal set optimistically

**File**: `src/app/pages/profile/profile.ts` lines 68-74

```typescript
saveProfile(): void {
  if (this.profileForm.invalid) return;
  const { displayName, bio } = this.profileForm.value;
  this.store.dispatch(AuthActions.updateProfile({ data: { displayName, bio } }));
  this.profileSaved.set(true);  // Set before knowing if API succeeded
  setTimeout(() => this.profileSaved.set(false), 3000);
}
```

**Problem**: The success message is shown immediately upon dispatch, before the API call completes. If the API returns an error, the user sees "Saved successfully!" followed by nothing or an error toast.

**Impact**: Misleading UX -- user thinks profile is saved when it may have failed.

**Fix**: Subscribe to `updateProfileSuccess` action or `AuthSelectors.selectError` to conditionally show success/error.

---

## Medium Priority

### M1. AI Generate: `removeTerm()` mutates signal with store-derived data

**File**: `src/app/pages/ai-generate/ai-generate.ts` line 96

```typescript
removeTerm(index: number): void {
  this.generatedTerms.update((terms) => terms.filter((_, i) => i !== index));
}
```

**Problem**: `generatedTerms` signal is synced from the store via `selectGeneratedTerms` subscription. Locally mutating it via `signal.update()` creates a disconnect -- the store still has the original terms. If any subsequent store emission occurs (e.g., usage update), the subscription will overwrite the local removals.

**Impact**: Removed terms may reappear if store re-emits.

**Fix**: Either dispatch an action to remove term from store state, or unsubscribe from the store after initial load and manage terms purely locally.

### M2. Quiz `Math.random() - 0.5` shuffle is biased

**File**: `src/app/pages/quiz/quiz.ts` line 111

```typescript
const terms = [...this.studySet.terms].sort(() => Math.random() - 0.5);
```

**Problem**: `Array.sort(() => Math.random() - 0.5)` is a known biased shuffle. Different sort algorithm implementations produce different distributions. Fisher-Yates shuffle is the correct approach.

**Impact**: Some quiz questions/options will appear more frequently in certain positions. Not a security issue but affects quiz fairness.

**Fix**: Use Fisher-Yates:
```typescript
private shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

### M3. `p-slider` two-way binding with signal `questionCount`

**File**: `src/app/pages/quiz/quiz.html` line 14

The `p-slider` component from PrimeNG uses `[(ngModel)]="questionCount"` where `questionCount` is a signal. This is the same core issue as C1 but specifically for the PrimeNG slider component. The slider won't be able to write back to the signal.

### M4. Missing `FormsModule` import check in study-set-form

**File**: `src/app/components/common/study-set-form/study-set-form.ts`

The component uses `[(ngModel)]` bindings in its template. `FormsModule` IS imported (line 3, 23). However, the `<p-select>` on line 34 of the template is self-closed with `/>`. This is fine for Angular components. No issue here after closer inspection.

### M5. AI Generate page does not navigate after save

**File**: `src/app/pages/ai-generate/ai-generate.ts` line 119

```typescript
this.store.dispatch(StudySetActions.createStudySet({ data: request }));
```

**Problem**: After dispatching `createStudySet`, the component does not navigate to the created study set. The `StudySetEffects.createStudySetSuccess$` effect does navigate to `/set/:id`, so this works transitively. However, there is no loading state feedback in the AI Generate page itself -- the `isSubmitting` state is not tracked.

**Impact**: User may click "Save" multiple times while waiting. No visual feedback.

**Fix**: Track `createStudySetSuccess` / `createStudySetFailure` in the component, or disable the save button after first click.

### M6. Hardcoded colors in flashcard.scss

**File**: `src/app/components/common/flashcard/flashcard.scss`

Multiple hardcoded color values that should reference SCSS variables:
- Line 33: `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);`
- Line 34: `background: white;`
- Line 42: `color: #666;`
- Line 49: `color: #2c3e50;`
- Line 85: `color: white;`
- Line 92: `color: #999;`
- Line 100: gradient values `#667eea`, `#764ba2`
- Line 112: gradient values `#f093fb`, `#f5576c`

Code standards state: "All colors must reference SCSS variables."

### M7. Edit study set does not update terms

**File**: `src/app/pages/edit-studyset/edit-studyset.ts` line 48-57

```typescript
onFormSubmit(data: StudySetFormData): void {
  if (!this.studySet) return;
  const request: UpdateStudySetRequest = {
    title: data.title,
    description: data.description || undefined,
    visibility: data.visibility,
  };
  this.store.dispatch(StudySetActions.updateStudySet({ id: this.studySet.id, data: request }));
}
```

**Problem**: The form includes terms (via `StudySetForm` which has a `TermEditor`), but the `UpdateStudySetRequest` does not include terms. Edited terms are silently discarded.

**Impact**: Users can edit terms in the form, click save, and their term changes are lost.

**Fix**: Either include term update logic (add/update/delete individual terms via separate actions), or hide the term editor on the edit page if term editing is not yet supported.

---

## Low Priority

### L1. Unused `Router` import in ai-generate.ts

**File**: `src/app/pages/ai-generate/ai-generate.ts` line 4

`Router` is injected but never used. The navigation after save happens via the `StudySetEffects` success effect.

### L2. Toast messages in AiEffects are in English, rest of UI is Vietnamese

**File**: `src/app/store/ai/ai.effects.ts` lines 104-108, 137-141

```typescript
summary: 'Terms Generated',
detail: `Successfully generated ${terms.length} terms`,
```

All other effects (StudySetEffects) use Vietnamese. AI effects use English.

**Fix**: Use Vietnamese consistently:
```typescript
summary: 'Tao thanh cong',
detail: `Da tao ${terms.length} thuat ngu`,
```

### L3. `<input type="number">` instead of PrimeNG InputNumber

**File**: `src/app/pages/ai-generate/ai-generate.html` line 27

Uses native `<input type="number">` instead of PrimeNG's `p-inputNumber`. Other forms in the project use PrimeNG components consistently. Minor consistency issue.

### L4. No `trackBy` optimization in library template function call

**File**: `src/app/pages/library/library.html` line 37

```html
@if (filterStudySets((studySets$ | async) ?? []); as filtered) {
```

`filterStudySets()` is a method call inside a template. On every change detection cycle, this function runs. While zoneless change detection mitigates frequent runs, a computed signal or memoized pipe would be more efficient.

### L5. `ai-generate.scss` hardcoded `#ef4444` color

**File**: `src/app/pages/ai-generate/ai-generate.scss` line 38

```scss
.required { color: #ef4444; }
```

Should use SCSS variable.

---

## Edge Cases Found by Scout

1. **Signal/ngModel incompatibility**: Three separate instances where signals are used with `[(ngModel)]` -- this is the most impactful finding.
2. **Store state overwrite after local mutation**: `removeTerm()` in ai-generate.ts locally mutates signal that is synced from store subscription; any re-emission overwrites local changes.
3. **Timer race condition**: `startTimer()` does not cancel existing timer before creating new one.
4. **TrueFalse quiz with 1 term**: If `allTerms.filter(v => v.id !== t.id)` returns empty array, the `[0]?.definition` falls back to `t.definition`, meaning the "false" option always shows the correct definition -- making the question trivially correct.
5. **Edit page discards term changes**: `UpdateStudySetRequest` does not carry terms, so term edits are silently lost.
6. **Fill blank fuzzy match**: NFD normalization strips diacritics. Vietnamese answers like "hoc sinh" vs "hoc sinh" work, but "hoc sinh" vs "Hoc Sinh" also matches, which might be too lenient for some quiz types.

---

## Positive Observations

1. **Clean NgRx architecture**: AI store follows the established auth/studyset pattern perfectly. Actions, reducer, effects, selectors all properly separated.
2. **SSR safety**: TTS `speak()` method properly guards with `isPlatformBrowser` and `window.speechSynthesis` check.
3. **Good subscription cleanup**: Components consistently use `Subscription` container or `Subject<void>` + `takeUntil` for cleanup.
4. **Speech API error handling**: The flashcard TTS implementation handles `onerror` callback to reset `isSpeaking`, and calls `speechSynthesis.cancel()` before new utterance.
5. **Lazy loading**: New routes properly use `loadComponent` for code splitting.
6. **Event propagation**: `speak()` correctly calls `event.stopPropagation()` to prevent card flip when clicking TTS button.
7. **Effects pattern**: `finalize()` used correctly to hide loading on both success and error paths.
8. **Type safety**: All types properly defined in `types/index.ts`. AI DTOs are well-structured.

---

## Recommended Actions (Prioritized)

1. **[CRITICAL]** Fix signal + ngModel incompatibility in `ai-generate.ts` (`saveTitle`), `quiz.ts` (`questionCount`, `fillBlankAnswer`). Convert to plain properties or use explicit `[ngModel]` + `(ngModelChange)` binding.
2. **[HIGH]** Add `this.stopTimer()` at start of `startTimer()` in `quiz.ts` to prevent timer leaks.
3. **[HIGH]** Add error state display in AI Generate page.
4. **[HIGH]** Replace `*ngIf` with `@if` in `profile.html`.
5. **[HIGH]** Fix optimistic success message in profile save.
6. **[MEDIUM]** Fix `removeTerm()` store/signal disconnect in AI Generate page.
7. **[MEDIUM]** Address edit study set term discarding or disable term editor on edit page.
8. **[MEDIUM]** Replace biased sort with Fisher-Yates shuffle in quiz.ts.
9. **[MEDIUM]** Move hardcoded colors to SCSS variables in flashcard.scss.
10. **[LOW]** Translate AI effects toast messages to Vietnamese.
11. **[LOW]** Remove unused `Router` import in ai-generate.ts.

---

## Metrics
- **Type Coverage**: High -- all types defined, no `any` usage detected
- **Test Coverage**: Unknown -- no test files reviewed
- **Linting Issues**: ~5 (self-closing input, hardcoded colors, legacy directive, unused import)

---

## Unresolved Questions

1. Is Angular 20.3's `[(ngModel)]` expected to work with signals natively? Angular 17.2+ added some signal interop, but the `FormsModule` two-way binding may still require plain properties. This needs compile-time verification.
2. Does the backend return the created study set ID in the `createStudySetSuccess` response? If not, the navigation in `StudySetEffects` will fail for the AI Generate save flow.
3. Are term updates via the edit page intentionally not supported yet, or is this an oversight?
