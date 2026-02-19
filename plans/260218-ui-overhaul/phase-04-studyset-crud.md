# Phase 4: Study Set CRUD & Library

## Context
- **Parent plan**: [plan.md](./plan.md)
- **Dependencies**: Phase 1 (design), Phase 3 (search-toolbar, view-toggle, empty-state)
- **Docs**: [PRD Section 2.2, 2.6, 4.3](../../docs/requirement.md)

## Overview
- **Date**: 2026-02-18
- **Description**: Build study set create/edit pages, term editor, library improvements, CRUD store actions
- **Priority**: P0
- **Effort**: 8h
- **Implementation status**: pending
- **Review status**: pending

## Key Insights
- Current StudySetService uses fake data — will add HTTP methods alongside for API-ready
- Library page has basic grid with spinner — needs DataView, toolbar, badges, pagination
- Term editor is the most complex component: FormArray, add/remove/reorder, inline edit
- Angular CDK DragDrop for term reordering (no extra install needed)
- StudySet create/edit share the same form component (`study-set-form`)

## Requirements
1. Extend StudySet NgRx store with CRUD actions
2. Create `term-editor` component (FormArray-based term list with add/remove/reorder)
3. Create `study-set-form` component (reusable form for create/edit)
4. Create Study Set Create page
5. Create Study Set Edit page
6. Enhance Library page (DataView, search-toolbar, view-toggle, badges, pagination)
7. Update studyset-card with new design (gradient, badges, term count)
8. Add routes: `/create-set`, `/set/:id/edit`
9. Update StudySetService with CRUD methods

## Architecture

### Study Set Form Component Tree
```
StudySetFormComponent
├── Title (InputText)
├── Description (Textarea)
├── Category (Dropdown)
├── Source Language (Dropdown)
├── Target Language (Dropdown)
├── Visibility (SelectButton: Public/Private)
├── Tags (Chips)
└── TermEditorComponent
    ├── Term row 1 [drag handle] [term input] [definition input] [delete btn]
    ├── Term row 2 [drag handle] [term input] [definition input] [delete btn]
    ├── ...
    └── [+ Add Term] button
```

### New NgRx Actions
```
StudySetActions (new):
├── createStudySet({ studySet })
├── createStudySetSuccess({ studySet })
├── createStudySetFailure({ error })
├── updateStudySet({ id, studySet })
├── updateStudySetSuccess({ studySet })
├── updateStudySetFailure({ error })
├── deleteStudySet({ id })
├── deleteStudySetSuccess({ id })
├── deleteStudySetFailure({ error })
├── setSearchQuery({ query })
├── setFilter({ filter })
└── setSortOrder({ sort })
```

## Related Code Files

### Modify
- `src/app/store/studyset/studyset.actions.ts` — add CRUD actions
- `src/app/store/studyset/studyset.reducer.ts` — handle CRUD + search/filter state
- `src/app/store/studyset/studyset.effects.ts` — CRUD effects
- `src/app/store/studyset/studyset.selectors.ts` — filtered/sorted selectors
- `src/app/store/studyset/studyset.state.ts` — add searchQuery, filter, sortOrder
- `src/app/services/studyset.service.ts` — add create/update/delete methods
- `src/app/pages/library/library.ts` — use DataView, toolbar, view-toggle
- `src/app/pages/library/library.html` — redesign template
- `src/app/pages/library/library.scss` — new styles
- `src/app/components/common/studyset-card/studyset-card.ts` — new design
- `src/app/components/common/studyset-card/studyset-card.html` — gradient, badges
- `src/app/app.routes.ts` — add create/edit routes
- `src/app/types/index.ts` — add CreateStudySetRequest, UpdateStudySetRequest

### Create (new files)
- `src/app/components/common/term-editor/term-editor.ts` + `.html` + `.scss`
- `src/app/components/common/study-set-form/study-set-form.ts` + `.html` + `.scss`
- `src/app/pages/create-studyset/create-studyset.ts` + `.html` + `.scss`
- `src/app/pages/edit-studyset/edit-studyset.ts` + `.html` + `.scss`

## Implementation Steps

### Step 1: Extend types
```typescript
export interface CreateStudySetRequest {
  title: string; description?: string; category?: string;
  sourceLanguage?: string; targetLanguage?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  tags?: string[];
  terms: { term: string; definition: string }[];
}
```

### Step 2: Extend StudySet store
- Add CRUD actions, reducer handlers, effects
- Add `searchQuery`, `filter`, `sortOrder` to state
- Add `selectFilteredStudySets` selector with memoized filtering

### Step 3: Create term-editor component
- Uses `FormArray` of `FormGroup` (term + definition required)
- `@Input() terms` for initial data, `@Output() termsChange` for parent
- Angular CDK `cdkDropList` + `cdkDrag` for reorder
- "Add Term" button appends new empty row
- Delete button per row (confirm if > 1 term)
- Tab navigation between fields

### Step 4: Create study-set-form component
- `@Input() mode: 'create' | 'edit'`
- `@Input() initialData?: StudySet` (for edit mode)
- `@Output() formSubmit` event with form value
- Reactive form with nested term-editor
- PrimeNG: InputText, Textarea, Dropdown, SelectButton, Chips

### Step 5: Create Study Set Create page
- Wraps study-set-form in `mode='create'`
- On submit: dispatch createStudySet action
- Navigate to `/set/:id` on success

### Step 6: Create Study Set Edit page
- Load study set by ID from route param
- Wraps study-set-form in `mode='edit'` with initial data
- On submit: dispatch updateStudySet action

### Step 7: Enhance Library page
- Replace simple grid with PrimeNG `DataView`
- Add search-toolbar (from Phase 3) at top
- Add view-toggle (grid/list switch)
- Use `Tag` for PUBLIC/PRIVATE badges
- Add `Paginator` for large sets
- Add "Create Study Set" FAB button

### Step 8: Update studyset-card
- Apply gradient card design from design system
- Show term count badge, author, created date
- Add hover actions (edit, delete for owned sets)

### Step 9: Add routes
```typescript
{ path: 'create-set', loadComponent: () => import('./pages/create-studyset/create-studyset').then(m => m.CreateStudySetPage) },
{ path: 'set/:id/edit', loadComponent: () => import('./pages/edit-studyset/edit-studyset').then(m => m.EditStudySetPage) },
```

## Todo
- [ ] Add CRUD types to index.ts
- [ ] Extend studyset store (actions, reducer, effects, selectors)
- [ ] Update StudySetService with CRUD methods
- [ ] Create term-editor component (FormArray + CDK DragDrop)
- [ ] Create study-set-form component
- [ ] Create Study Set Create page
- [ ] Create Study Set Edit page
- [ ] Redesign Library page (DataView, toolbar, badges)
- [ ] Update studyset-card (gradient design, badges)
- [ ] Add routes (create-set, edit)
- [ ] Test CRUD flow end-to-end

## Success Criteria
- Create study set form validates and submits correctly
- Terms can be added, removed, reordered via drag-and-drop
- Library shows search/filter/sort toolbar
- Grid/list view toggle works
- PUBLIC/PRIVATE badges display on cards
- Edit page pre-populates form with existing data
- Lazy-loaded routes work correctly

## Risk Assessment
| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Backend API not ready for CRUD | High | Keep fake data methods as fallback |
| CDK DragDrop SSR compatibility | Medium | Guard with `isPlatformBrowser` |
| FormArray validation complex | Low | Start simple, add validators incrementally |

## Next Steps
Phase 5 (Flashcard & Quiz) can start after Phase 1. Phase 6 (AI) depends on this phase's store patterns.
