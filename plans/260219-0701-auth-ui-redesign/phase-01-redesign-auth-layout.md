# Phase 01 — Redesign Auth Layout

## Overview
- **Priority**: High (blocks Phase 2 & 3)
- **Status**: pending
- **Files owned**:
  - `src/app/layouts/auth/auth.html`
  - `src/app/layouts/auth/auth.scss`

## Key Insights
<!-- Updated: Validation Session 1 - Replace circles with gradient + CSS dot/grid pattern -->
- Remove external Quizlet image URL — use CSS-only gradient + dot grid pattern
- Left panel: dark gradient (`$bg-primary` → `$bg-secondary`) with radial-gradient dot grid overlay + floating circles
- Right panel: white background, centered `<router-outlet>`
- Mobile < 768px: hide left panel entirely, right panel fills full width
- BEM class prefix: `bl_auth` (keep existing prefix for continuity)
- Auth layout SCSS must include shared `.bl_input_group` styles (cascade to signin/signup children)

## Requirements
- No external image dependencies
- CSS-only decorative elements (no SVG files, no `<img>` tags)
- Logo text "QuizCard" — large, white, bold
- Tagline: "Học thông minh hơn mỗi ngày" — smaller, muted
- Decorative: gradient background + radial-gradient dot grid + floating circles (combined)
- Right panel max-width constraint handled by child form (420px)
- Smooth gradient transition on left panel
- Shared `.bl_input_group` styles in auth.scss for all child form components

## Implementation Steps

### Step 1 — Rewrite `auth.html`

Replace contents of `src/app/layouts/auth/auth.html`:

```html
<section class="bl_auth">
    <div class="bl_auth__left">
        <div class="bl_auth__left-circle bl_auth__left-circle--lg"></div>
        <div class="bl_auth__left-circle bl_auth__left-circle--md"></div>
        <div class="bl_auth__left-circle bl_auth__left-circle--sm"></div>
        <div class="bl_auth__left-content">
            <div class="bl_auth__logo">
                <span class="bl_auth__logo-icon">Q</span>
                <span class="bl_auth__logo-name">QuizCard</span>
            </div>
            <h1 class="bl_auth__tagline">Học thông minh hơn mỗi ngày</h1>
            <p class="bl_auth__sub">Ghi nhớ nhanh hơn với thẻ flashcard và luyện tập thông minh.</p>
            <div class="bl_auth__features">
                <div class="bl_auth__feature-item">
                    <span class="bl_auth__feature-dot"></span>
                    <span>Flashcard thông minh với AI</span>
                </div>
                <div class="bl_auth__feature-item">
                    <span class="bl_auth__feature-dot"></span>
                    <span>Luyện tập có lộ trình cá nhân hóa</span>
                </div>
                <div class="bl_auth__feature-item">
                    <span class="bl_auth__feature-dot"></span>
                    <span>Quiz tự động từ nội dung học</span>
                </div>
            </div>
        </div>
    </div>
    <div class="bl_auth__right">
        <router-outlet></router-outlet>
    </div>
</section>
```

### Step 2 — Rewrite `auth.scss`

Replace contents of `src/app/layouts/auth/auth.scss`:

```scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.bl_auth {
  display: flex;
  height: 100%;
  min-height: 100vh;
  font-family: $font-family;

  // ── Left panel ──────────────────────────────────────────────────────────
  &__left {
    position: relative;
    flex: 0 0 50%;
    overflow: hidden;
    background:
      radial-gradient(circle, rgba($accent-color, 0.12) 1px, transparent 1px),
      linear-gradient(145deg, $bg-primary 0%, $bg-secondary 60%, #0d2137 100%);
    background-size: 24px 24px, 100% 100%;

    @media (max-width: 768px) {
      display: none;
    }
  }

  // Decorative floating circles (CSS-only, no images)
  &__left-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba($accent-color, 0.08);
    border: 1px solid rgba($accent-color, 0.15);

    &--lg {
      width: 380px;
      height: 380px;
      top: -80px;
      right: -100px;
    }

    &--md {
      width: 240px;
      height: 240px;
      bottom: 60px;
      left: -60px;
      background: rgba(#6366f1, 0.07);
      border-color: rgba(#6366f1, 0.12);
    }

    &--sm {
      width: 120px;
      height: 120px;
      bottom: 220px;
      right: 60px;
      background: rgba($accent-color, 0.05);
      border-color: rgba($accent-color, 0.1);
    }
  }

  &__left-content {
    position: relative;
    z-index: 1;
    height: 100%;
    @include flex-column-center;
    padding: 48px 56px;
  }

  // Logo
  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
  }

  &__logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: $accent-color;
    color: #fff;
    font-size: 22px;
    font-weight: 800;
    border-radius: 10px;
  }

  &__logo-name {
    font-size: 26px;
    font-weight: 700;
    color: $text-primary;
    letter-spacing: -0.3px;
  }

  // Tagline
  &__tagline {
    font-size: 32px;
    font-weight: 700;
    color: $text-primary;
    line-height: 1.3;
    margin: 0 0 16px;
    text-align: center;
  }

  &__sub {
    font-size: 15px;
    color: $text-secondary;
    line-height: 1.6;
    text-align: center;
    margin: 0 0 40px;
    max-width: 340px;
  }

  // Feature bullet list
  &__features {
    @include flex-column;
    gap: 16px;
    width: 100%;
    max-width: 320px;
  }

  &__feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: $text-secondary;
    font-size: 14px;
  }

  &__feature-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    min-width: 8px;
    border-radius: 50%;
    background: $accent-color;
  }

  // ── Right panel ─────────────────────────────────────────────────────────
  &__right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8fafc;
    padding: 32px 16px;
    overflow-y: auto;

    @media (max-width: 768px) {
      flex: 1;
      padding: 24px 16px;
    }
  }
}

// ── Shared input group styles (cascades to signin/signup children) ──────
.bl_input_group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  &__input {
    height: 44px !important;
    border-radius: 10px !important;
    border: 1px solid #d1d5db !important;
    font-size: 14px !important;
    padding: 0 14px !important;
    width: 100% !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    background: #fff !important;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: $accent-color !important;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15) !important;
      outline: none;
    }

    &:hover:not(:focus) {
      border-color: #9ca3af !important;
    }
  }

  // PrimeNG p-password inner input
  ::ng-deep .p-password {
    width: 100%;

    input.p-inputtext {
      height: 44px;
      border-radius: 10px;
      border: 1px solid #d1d5db;
      font-size: 14px;
      padding: 0 44px 0 14px;
      width: 100%;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      background: #fff;

      &::placeholder { color: #9ca3af; }

      &:focus {
        border-color: $accent-color;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        outline: none;
      }

      &:hover:not(:focus) { border-color: #9ca3af; }
    }

    .p-password-toggle-mask-icon {
      color: #6b7280;
      cursor: pointer;

      &:hover { color: $accent-color; }
    }
  }

  p-message {
    display: block;
    margin-top: 2px;
  }
}
```

## Todo

- [ ] Rewrite `src/app/layouts/auth/auth.html` with new left/right panel structure
- [ ] Rewrite `src/app/layouts/auth/auth.scss` with CSS-only decorative circles and responsive rules
- [ ] Verify no external image URLs remain
- [ ] Verify `router-outlet` still renders correctly in right panel
- [ ] Verify mobile: left panel hidden below 768px

## Success Criteria
- Auth layout renders 50/50 split on desktop
- Left panel shows dark gradient, QuizCard logo, tagline, feature bullets, CSS circles
- Right panel has light (#f8fafc) background, centered content
- No external image URLs in SCSS
- Below 768px: only right panel visible, full width
- `router-outlet` inside right panel, all child routes unaffected

## Risk Assessment
- Low risk — layout-only changes, no TypeScript, no store
- `router-outlet` placement preserved
