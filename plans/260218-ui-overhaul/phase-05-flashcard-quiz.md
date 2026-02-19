# Phase 5: Flashcard & Quiz Improvements + Profile Page

## Context
- **Parent plan**: [plan.md](./plan.md)
- **Dependencies**: Phase 1 (gradient card design)
- **Docs**: [PRD Section 2.4, 4.4, 2.1.4](../../docs/requirement.md)

## Overview
- **Date**: 2026-02-18
- **Description**: Upgrade flashcard with gradient design/progress/shuffle/mark-learned, add new quiz types (T/F, fill-blank, matching), create profile page
- **Priority**: P1
- **Effort**: 8h
- **Implementation status**: pending
- **Review status**: pending

## Key Insights
- Flashcard component already has flip animation with signals — extend, don't rewrite
- Quiz page already has multiple-choice + timer — add new question type renderers
- Use strategy pattern: each question type is a template/component, quiz engine is shared
- Profile page is straightforward: avatar, stats, change password form
- Matching question type is the most complex (drag-drop pairs)

## Requirements

### Flashcard Improvements
1. Gradient card design (purple-blue per PRD)
2. Progress bar (PrimeNG ProgressBar, not just text counter)
3. Shuffle button (randomize vocabulary order)
4. Mark as "đã thuộc" (learned) / "cần ôn lại" (needs review)
5. Toggle: show term first vs definition first
6. Instruction text: "Click card to flip", "← / → to navigate"

### Quiz Improvements
7. True/False question type
8. Fill-in-the-blank question type (type the answer)
9. Matching question type (drag term↔definition pairs)
10. Quiz config: select question types (checkboxes), mix or single type
11. Update question generation to support all types

### Profile Page
12. Create Profile page: avatar, display name, bio, learning stats
13. Change password form
14. Route: `/profile`

## Architecture

### Flashcard State (extended signals)
```typescript
currentIndex = signal(0);
isFlipped = signal(false);
showTermFirst = signal(true);
learnedSet = signal<Set<string>>(new Set());
shuffledOrder = signal<number[]>([]);
```

### Quiz Question Type Strategy
```
QuizPage
├── Setup screen (question count + type selection)
├── Quiz screen
│   ├── @switch (currentQuestion.type)
│   │   ├── case 'multiple_choice': MultipleChoiceTemplate
│   │   ├── case 'true_false': TrueFalseTemplate
│   │   ├── case 'fill_blank': FillBlankTemplate
│   │   └── case 'matching': MatchingTemplate
│   └── Timer + progress (shared)
└── Result screen (shared)
```

### Profile Page Layout
```
┌─────────────────────────────────────┐
│  ┌──────┐  Display Name             │
│  │Avatar│  email@example.com         │
│  └──────┘  Bio text here...          │
├─────────────────────────────────────┤
│  Learning Stats                      │
│  [Streak: 5] [Words: 142] [Quizzes] │
├─────────────────────────────────────┤
│  Change Password                     │
│  [Current pw] [New pw] [Confirm pw]  │
│  [Save Changes]                      │
└─────────────────────────────────────┘
```

## Related Code Files

### Modify
- `src/app/components/common/flashcard/flashcard.ts` — gradient, progress, shuffle, mark
- `src/app/components/common/flashcard/flashcard.html` — new controls
- `src/app/components/common/flashcard/flashcard.scss` — gradient design
- `src/app/pages/studyset-detail/studyset-detail.ts` — shuffle, learned tracking, flip-order
- `src/app/pages/studyset-detail/studyset-detail.html` — new controls bar
- `src/app/pages/studyset-detail/studyset-detail.scss` — updated layout
- `src/app/pages/quiz/quiz.ts` — new question types, config, generation logic
- `src/app/pages/quiz/quiz.html` — add T/F, fill-blank, matching templates
- `src/app/pages/quiz/quiz.scss` — styles for new question types
- `src/app/types/index.ts` — extend QuizQuestion with `type` field
- `src/app/app.routes.ts` — add /profile route

### Create (new files)
- `src/app/pages/profile/profile.ts` + `.html` + `.scss`

## Implementation Steps

### Step 1: Update QuizQuestion type
```typescript
export interface QuizQuestion {
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  vocabulary: Vocabulary;
  options?: string[];       // for multiple_choice
  correctAnswer: string;
  statement?: string;       // for true_false
  isTrue?: boolean;         // for true_false
  matchPairs?: { term: string; definition: string }[];  // for matching
}
```

### Step 2: Upgrade flashcard component
- Replace background with `$gradient-card`
- Add ProgressBar below card
- Add toolbar: shuffle icon button, flip-order toggle, mark-learned button
- Shuffle logic: Fisher-Yates shuffle on vocab indices
- Learned set: signal<Set<string>>, toggle on button click, skip option

### Step 3: Update studyset-detail page
- Add controls bar above flashcard: progress bar, shuffle, flip-order
- Track learned/needs-review counts
- Show "X/Y đã thuộc" counter
- Persist learned set in component (not store — per session)

### Step 4: Add True/False question type
- Generate by showing a term with a random (possibly wrong) definition
- User clicks "Đúng" or "Sai"
- Use PrimeNG ButtonModule for T/F buttons

### Step 5: Add Fill-in-blank question type
- Show definition, user types the term
- Use PrimeNG InputText
- Fuzzy matching: trim, lowercase, ignore accents for comparison
- Show correct answer after submission

### Step 6: Add Matching question type
- Show N terms on left, N definitions on right (shuffled)
- User drags/connects pairs
- Use Angular CDK DragDrop with `cdkDropList` containers
- Guard with `isPlatformBrowser` for SSR

### Step 7: Update quiz setup screen
- Add PrimeNG Checkbox group for question types
- Options: "Trắc nghiệm", "Đúng/Sai", "Điền từ", "Nối cặp"
- "Mix" option selects all types randomly

### Step 8: Update question generation
- Based on selected types, generate appropriate questions
- Multiple choice: existing logic (4 options)
- True/False: random correct/incorrect definition pairing
- Fill-blank: term as answer, definition as prompt
- Matching: batch of 4-5 pairs per question

### Step 9: Create Profile page
- PrimeNG Avatar, InputText, Textarea, Password, Divider
- Reactive form for profile edit + change password
- Display learning stats (from store or service)
- Add route: `{ path: 'profile', loadComponent: () => ... }`

## Todo
- [ ] Extend QuizQuestion type with `type` field
- [ ] Upgrade flashcard gradient design + SCSS
- [ ] Add flashcard progress bar
- [ ] Add shuffle functionality (Fisher-Yates)
- [ ] Add mark-learned toggle
- [ ] Add flip-order toggle (term/definition first)
- [ ] Update studyset-detail controls bar
- [ ] Implement True/False question type
- [ ] Implement Fill-in-blank question type
- [ ] Implement Matching question type (CDK DragDrop)
- [ ] Update quiz setup screen with type checkboxes
- [ ] Update question generation for all types
- [ ] Create Profile page
- [ ] Add /profile route

## Success Criteria
- Flashcard shows gradient design with progress bar
- Shuffle randomizes card order
- Mark-learned toggles and shows counter
- True/False questions work with correct answer validation
- Fill-blank accepts fuzzy matching
- Matching drag-drop functions correctly
- Quiz config allows selecting question types
- Profile page renders with user info and change password form

## Security Considerations
- Change password: validate current password on backend
- Profile update: sanitize display name and bio input

## Risk Assessment
| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Matching DragDrop SSR crash | Medium | `isPlatformBrowser` guard |
| Fill-blank fuzzy matching too lenient | Low | Start with exact match, add fuzzy later |
| Quiz generation logic complex | Medium | Test each type independently |

## Next Steps
Phase 6 (AI Generate) can start after Phase 3 (uses ai-usage-badge).
