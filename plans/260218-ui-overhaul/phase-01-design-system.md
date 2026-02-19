# Phase 1: Design System & Foundation

## Context
- **Parent plan**: [plan.md](./plan.md)
- **Dependencies**: None (this is the foundation)
- **Docs**: [PRD Section 4.7](../../docs/requirement.md), [Code Standards](../../docs/code-standards.md)

## Overview
- **Date**: 2026-02-18
- **Description**: Update design tokens, fonts, global styles, and PrimeNG theme to match PRD spec
- **Priority**: P0 (all other phases depend on this)
- **Effort**: 4h
- **Implementation status**: pending
- **Review status**: pending

## Key Insights
- Current SCSS variables are minimal — only colors and sidebar width defined
- PRD specifies a distinct color palette (#0f172a bg, #22c55e accent, gradient cards)
- Font change from system fonts to Inter + Noto Sans (Google Fonts)
- PrimeNG Aura theme needs custom token overrides for dark mode

## Requirements
1. Update SCSS variables to PRD design tokens
2. Add Inter + Noto Sans font loading
3. Update `styles.scss` global styles (body bg, font-family)
4. Add new SCSS variables for gradients, border-radius, text colors
5. Update PrimeNG theme config with new surface/primary colors
6. Add CSS custom properties for runtime theming flexibility

## Related Code Files

### Modify
- `src/app/styles/_variables.scss` — design tokens
- `src/app/styles/_mixins.scss` — add new mixins (gradient-card, etc.)
- `src/styles.scss` — global styles, font import
- `src/app/app.config.ts` — PrimeNG theme overrides
- `src/index.html` — Google Fonts link tag

### Read (reference)
- `src/app/pages/dashboard/dashboard.ts` — hardcoded inline colors to note
- `src/app/components/common/header/header.component.scss`
- `src/app/components/common/sidebar/sidebar.component.scss`

## Implementation Steps

### Step 1: Update `_variables.scss`
```scss
// New PRD design tokens
$bg-primary: #0f172a;
$bg-secondary: #1e293b;
$bg-card: #1e3a5f;
$accent-color: #22c55e;
$accent-hover: #16a34a;
$text-primary: #ffffff;
$text-secondary: #94a3b8;
$border-color: #334155;
$gradient-card: linear-gradient(135deg, #6366f1, #a855f7, #6366f1);
$radius-card: 12px;
$radius-button: 8px;
$font-family: 'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, sans-serif;

// Keep backward compat aliases
$main-color: $bg-card;
$main-color-light: #c8dcf7;
$main-color-light-bold: #5888c7;
$color-hover-tab: #1e3a5f;
```

### Step 2: Add new mixins to `_mixins.scss`
```scss
@mixin gradient-card {
  background: $gradient-card;
  border-radius: $radius-card;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
}

@mixin card-base {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-card;
  padding: 1.5rem;
}
```

### Step 3: Update `styles.scss`
```scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap');

body {
  font-family: $font-family;
  background: $bg-primary;
  color: $text-primary;
}
```

### Step 4: Update PrimeNG theme in `app.config.ts`
Override Aura preset surface colors to match dark theme.

### Step 5: Add Google Fonts to `src/index.html`
Preconnect + font link for performance.

## Todo
- [ ] Update `_variables.scss` with PRD design tokens
- [ ] Add gradient-card and card-base mixins
- [ ] Update `styles.scss` (font import, body styles)
- [ ] Add Google Fonts link to `index.html` with preconnect
- [ ] Update PrimeNG Aura theme overrides in `app.config.ts`
- [ ] Verify all existing components render correctly with new tokens
- [ ] Test SSR rendering with new styles

## Success Criteria
- All SCSS variables match PRD Section 4.7 spec
- Inter + Noto Sans fonts load correctly
- Background color is #0f172a across all pages
- PrimeNG components use updated surface colors
- No visual regressions on existing pages
- SSR renders correct styles

## Risk Assessment
| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Existing components break with new colors | Medium | Keep backward compat aliases |
| Font FOUT (Flash of Unstyled Text) | Low | Use `font-display: swap`, preconnect |
| PrimeNG theme override conflicts | Low | Test each component after override |

## Next Steps
After completion, Phase 2 (Auth Pages) and Phase 3 (Home & Shared) can start in parallel.
