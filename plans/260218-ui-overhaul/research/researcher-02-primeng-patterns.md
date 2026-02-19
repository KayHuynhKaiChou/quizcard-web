# PrimeNG Components & Angular Patterns for UI Overhaul

## Feature → PrimeNG Component Mapping

### 1. Auth Pages (Register, Verify, Forgot/Reset Password)
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| InputText | `InputTextModule` | Email, name fields |
| Password | `PasswordModule` | Password with strength meter |
| Button | `ButtonModule` | Submit buttons |
| Message | `MessageModule` | Validation errors |
| Toast | `ToastModule` | Success/error notifications |
| Steps | `StepsModule` | Registration progress indicator |
| **Pattern**: Reactive Forms (`FormGroup`, `Validators`) for all forms.

### 2. Home Page Redesign
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| Card | `CardModule` | Study set cards |
| Tag | `TagModule` | Category tags, AI usage badge |
| Badge | `BadgeModule` | Notification count |
| Skeleton | `SkeletonModule` | Loading placeholders |
| Carousel | `CarouselModule` | "Continue learning" horizontal scroll |
| **Custom**: Stats cards (streak, words) - custom component, no PrimeNG match.

### 3. Library (Search, Filter, Grid/List)
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| InputText | `InputTextModule` | Search input |
| Dropdown | `DropdownModule` | Category/language filter |
| SelectButton | `SelectButtonModule` | Grid/List view toggle |
| DataView | `DataViewModule` | Grid/List switchable layout |
| Tag | `TagModule` | PUBLIC/PRIVATE badges |
| Paginator | `PaginatorModule` | Pagination |
| **Pattern**: Use `DataView` with custom templates for grid/list modes.

### 4. Flashcard Improvements
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| ProgressBar | `ProgressBarModule` | Card progress |
| ToggleButton | `ToggleButtonModule` | Term/definition flip order |
| Button | `ButtonModule` | Shuffle, nav buttons |
| **Custom**: Gradient flip card - pure CSS/SCSS animation. No PrimeNG component.
| **Custom**: Mark learned/needs review toggle - custom button group.
| **Pattern**: Signals for flip state, current index, learned set.

### 5. AI Generate Page
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| Textarea | `TextareaModule` | Prompt input |
| InputNumber | `InputNumberModule` | Word count selection |
| Dropdown | `DropdownModule` | Language, difficulty selectors |
| Table | `TableModule` | Generated terms preview/edit |
| Tag | `TagModule` | AI quota badge |
| ProgressBar | `ProgressBarModule` | Generation progress |
| InlineEdit | (in Table) | Edit term/definition inline |
| Toolbar | `ToolbarModule` | Action buttons bar |
| **Pattern**: Reactive form for prompt options. Signal for generation state.

### 6. Quiz Improvements
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| RadioButton | `RadioButtonModule` | True/False selection |
| InputText | `InputTextModule` | Fill-in-blank answer |
| OrderList | `OrderListModule` | Matching drag-drop (term↔definition) |
| Checkbox | `CheckboxModule` | Quiz config question types |
| **Custom**: Matching mode - custom drag-drop pairs. Use Angular CDK DragDrop.
| **Pattern**: Strategy pattern for different question type renderers.

### 7. Study Set CRUD (Create/Edit)
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| InputText | `InputTextModule` | Title, description |
| Dropdown | `DropdownModule` | Category, language selectors |
| Table | `TableModule` | Term list editor |
| Button | `ButtonModule` | Add/remove/save |
| FileUpload | `FileUploadModule` | CSV import |
| Chips | `ChipsModule` | Tags input |
| SelectButton | `SelectButtonModule` | Public/Private toggle |
| **Drag-Drop**: Angular CDK `DragDropModule` for term reorder.
| **Pattern**: Reactive form with `FormArray` for terms list.

### 8. Profile Page
| Component | PrimeNG Module | Purpose |
|-----------|---------------|---------|
| Avatar | `AvatarModule` | User avatar |
| FileUpload | `FileUploadModule` | Avatar upload |
| InputText | `InputTextModule` | Display name, bio |
| Password | `PasswordModule` | Change password |
| Divider | `DividerModule` | Section separator |
| **Custom**: Learning stats dashboard - custom cards with icons.

## Design System Strategy

### Font Loading
```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```
```scss
// styles.scss
body { font-family: 'Inter', 'Noto Sans', sans-serif; }
```

### CSS Custom Properties (Design Tokens)
```scss
// _variables.scss - update existing
$bg-primary: #0f172a;
$bg-card: #1e3a5f;
$accent-green: #22c55e;
$text-primary: #ffffff;
$text-secondary: #94a3b8;
$border-color: #334155;
$gradient-card: linear-gradient(135deg, #6366f1, #a855f7, #6366f1);
$radius-card: 12px;
$radius-button: 8px;
```

### Drag-and-Drop for Term Reorder
Use Angular CDK `DragDropModule` (not PrimeNG):
```bash
# Already included with Angular — no extra install
```
```typescript
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
```

## New PrimeNG Modules to Import (not yet used)
- `TextareaModule`, `DropdownModule`, `SelectButtonModule`
- `DataViewModule`, `TableModule`, `TagModule`
- `InputNumberModule`, `ChipsModule`, `FileUploadModule`
- `AvatarModule`, `DividerModule`, `SkeletonModule`
- `CarouselModule`, `ToolbarModule`, `PaginatorModule`
- `StepsModule`, `RadioButtonModule`, `CheckboxModule`
- `OrderListModule`, `ToggleButtonModule`
