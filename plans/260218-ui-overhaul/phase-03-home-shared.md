# Phase 3: Home Page & Shared Components

## Context
- **Parent plan**: [plan.md](./plan.md)
- **Dependencies**: Phase 1 (design tokens)
- **Docs**: [PRD Section 2.5, 4.2](../../docs/requirement.md)

## Overview
- **Date**: 2026-02-18
- **Description**: Build reusable shared components, redesign dashboard, update sidebar navigation
- **Priority**: P0
- **Effort**: 6h
- **Implementation status**: pending
- **Review status**: pending

## Key Insights
- Dashboard currently has hardcoded inline template with 4 static cards — needs full redesign
- PRD wants 3 sections: "Tiếp tục học", "Được đề xuất", "Phổ biến" with dynamic data
- Shared components (stats-card, search-toolbar, etc.) are reused across phases 4-6
- Sidebar needs 2 new nav items: "Khám phá" and potentially "Tạo bằng AI"

## Requirements
1. Create `stats-card` component — displays stat with icon + value + label
2. Create `empty-state` component — icon + message for empty lists
3. Create `ai-usage-badge` component — "Còn X/5 lượt AI hôm nay"
4. Create `search-toolbar` component — search input + filter dropdown + sort
5. Create `view-toggle` component — grid/list toggle with SelectButton
6. Redesign Dashboard page with 3 sections + stats row + AI badge
7. Update Sidebar with new nav items
8. Add PrimeNG Skeleton loading states

## Architecture

### Dashboard Layout
```
┌─────────────────────────────────────────────┐
│  Welcome, {user.displayName}!               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Streak  │ │ Words   │ │ AI Left │       │
│  │  🔥 5   │ │ 📚 42  │ │ 🤖 3/5 │       │
│  └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────┤
│  Tiếp tục học (Continue Learning)           │
│  [card] [card] [card] [card]  →             │
├─────────────────────────────────────────────┤
│  Được đề xuất (Recommended)                 │
│  [card] [card] [card] [card]                │
├─────────────────────────────────────────────┤
│  Phổ biến (Popular)                         │
│  [card] [card] [card] [card]                │
└─────────────────────────────────────────────┘
```

### Component Tree
```
DashboardPage
├── stats-card (streak)
├── stats-card (words today)
├── ai-usage-badge
├── Section: "Tiếp tục học"
│   └── studyset-card[] (horizontal scroll or carousel)
├── Section: "Được đề xuất"
│   └── studyset-card[] (4-col grid)
└── Section: "Phổ biến"
    └── studyset-card[] (4-col grid)
```

## Related Code Files

### Modify
- `src/app/pages/dashboard/dashboard.ts` — full redesign (remove inline template)
- `src/app/components/common/sidebar/sidebar.component.ts` — add nav items
- `src/app/components/common/sidebar/sidebar.component.html` — add links

### Create (new files)
- `src/app/components/common/stats-card/stats-card.ts` + `.html` + `.scss`
- `src/app/components/common/empty-state/empty-state.ts` + `.html` + `.scss`
- `src/app/components/common/ai-usage-badge/ai-usage-badge.ts` + `.html` + `.scss`
- `src/app/components/common/search-toolbar/search-toolbar.ts` + `.html` + `.scss`
- `src/app/components/common/view-toggle/view-toggle.ts` + `.html` + `.scss`
- `src/app/pages/dashboard/dashboard.html` (extract from inline)
- `src/app/pages/dashboard/dashboard.scss` (extract from inline)

## Implementation Steps

### Step 1: Create stats-card component
```typescript
@Component({ selector: 'app-stats-card', standalone: true, ... })
export class StatsCard {
  @Input() icon: string = '';      // PrimeIcon class
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() color: string = '';     // accent color
}
```

### Step 2: Create empty-state component
```typescript
@Component({ selector: 'app-empty-state', standalone: true, ... })
export class EmptyState {
  @Input() icon: string = 'pi-inbox';
  @Input() title: string = 'Không có dữ liệu';
  @Input() message: string = '';
}
```

### Step 3: Create ai-usage-badge component
- Displays "🤖 Còn X/5 lượt AI hôm nay"
- Uses TagModule from PrimeNG
- Input: `remaining` and `max` numbers
- Color changes: green (3+), yellow (1-2), red (0)

### Step 4: Create search-toolbar component
- PrimeNG InputText for search + Dropdown for filter + Sort dropdown
- Outputs: `(searchChange)`, `(filterChange)`, `(sortChange)` events
- Configurable filter options via `@Input()`

### Step 5: Create view-toggle component
- PrimeNG SelectButton with grid/list options
- Output: `(viewChange)` event with 'grid' | 'list'

### Step 6: Redesign Dashboard
- Extract from inline template to separate `.html` + `.scss` files
- Add 3 sections with NgRx data binding
- Use `@for` with `track` for card lists
- Use PrimeNG Skeleton for loading states
- 4-column responsive grid: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`

### Step 7: Update Sidebar
Add new nav items to `navItems` array:
```typescript
{ label: 'Khám phá', icon: 'pi-compass', route: '/explore' },
{ label: 'Tạo bằng AI', icon: 'pi-sparkles', route: '/ai-generate' },
```

## Todo
- [ ] Create stats-card component
- [ ] Create empty-state component
- [ ] Create ai-usage-badge component
- [ ] Create search-toolbar component
- [ ] Create view-toggle component
- [ ] Redesign Dashboard page (extract from inline, 3 sections)
- [ ] Add Skeleton loading states
- [ ] Update Sidebar with new nav items
- [ ] Test responsive layout (desktop + mobile)

## Success Criteria
- Dashboard shows 3 sections with study set cards
- Stats row displays streak, words count, AI quota
- All shared components render correctly in isolation
- Responsive: 4 cols desktop → 2 cols tablet → 1 col mobile
- Sidebar shows all nav items including new ones
- Loading skeletons appear while data loads

## Risk Assessment
| Risk | Probability | Mitigation |
|------|-------------|-----------|
| No real data for dashboard sections | High | Use fake data from StudySetService, categorize by set |
| AI usage data not available yet | High | Default to 5/5 remaining, wire up in Phase 6 |

## Next Steps
Phase 4 (Study Set CRUD) can start after this phase, as it uses search-toolbar and view-toggle.
