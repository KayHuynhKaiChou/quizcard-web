---
title: "QuizCard UI Overhaul"
description: "Implement new UI pages and improve existing ones per PRD requirement.md"
status: complete
priority: P0
effort: 40h
branch: master
tags: [ui, angular, primeng, ngrx, auth, studyset, ai, quiz]
created: 2026-02-18
---

# QuizCard UI Overhaul - Implementation Plan

## Overview

Implement the full frontend UI described in `docs/requirement.md`, spanning new auth pages, home redesign, study set CRUD, flashcard/quiz improvements, AI generation page, and design system update.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Design System & Foundation | 4h | complete | [phase-01](./phase-01-design-system.md) |
| 2 | Auth Pages & Store | 8h | complete | [phase-02](./phase-02-auth-pages.md) |
| 3 | Home Page & Shared Components | 6h | complete | [phase-03](./phase-03-home-shared.md) |
| 4 | Study Set CRUD & Library | 8h | complete | [phase-04](./phase-04-studyset-crud.md) |
| 5 | Flashcard & Quiz Improvements | 8h | complete | [phase-05](./phase-05-flashcard-quiz.md) |
| 6 | AI Generate & Advanced Features | 6h | complete | [phase-06](./phase-06-ai-generate.md) |

## Dependencies

- Phase 1 must complete first (all phases depend on design tokens)
- Phase 2 is independent after Phase 1
- Phase 3 depends on Phase 1 (shared components used everywhere)
- Phase 4 depends on Phase 3 (shared components: search-toolbar, view-toggle)
- Phase 5 depends on Phase 1 (gradient card design)
- Phase 6 depends on Phase 3 (ai-usage-badge component)

## Validated Decisions (2026-02-18)

1. **Design system**: Global update — apply new PRD design tokens (#0f172a bg, Inter font, #22c55e accent) to ALL existing and new pages
2. **API strategy**: Mock responses in NgRx effects — build all UI first, wire to real API later
3. **Scope**: All 6 phases — full implementation of PRD requirements (~40h)
4. **Auth API paths**: Use PRD endpoints (`/api/auth/*`) — mock until backend ready
5. **NgRx pattern reuse** — all new store slices follow existing auth/ pattern
6. **Standalone components only** — no NgModules, `inject()` DI, signals for local state
7. **PrimeNG first** — use PrimeNG components where available, custom only when needed
8. **SCSS variables only** — no hardcoded colors, all reference `_variables.scss`
9. **SSR-safe** — `isPlatformBrowser` guard for browser APIs (localStorage, speechSynthesis)

## Reference Docs

- [PRD](../../docs/requirement.md)
- [Codebase Summary](../../docs/codebase-summary.md)
- [Code Standards](../../docs/code-standards.md)
- [System Architecture](../../docs/system-architecture.md)
- [Gap Analysis](./research/researcher-01-gap-analysis.md)
- [PrimeNG Patterns](./research/researcher-02-primeng-patterns.md)
