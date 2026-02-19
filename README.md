# QuizCard - Angular Client

A modern Quizlet-style vocabulary flashcard and quiz application built with Angular 20.3, featuring real-time study sets, interactive flashcards, and AI-powered quizzes.

## Features

- **User Authentication**: Secure sign-in with JWT tokens
- **Study Sets**: Browse and study vocabulary flashcard sets
- **Flashcard Mode**: Interactive flip-animation flashcards with keyboard navigation
- **Quiz Mode**: Multiple-choice quizzes with timer, auto-advance, and instant feedback
- **Learning Tracking**: Quiz results with score, accuracy percentage, and time analysis
- **Dark Theme UI**: Modern dark interface using PrimeNG Aura theme
- **SSR Ready**: Server-Side Rendering support with Express.js
- **State Management**: NgRx-based state management with localStorage persistence

## Tech Stack

- **Framework**: Angular 20.3 (standalone components, zoneless change detection)
- **State Management**: NgRx 20.1 with Effects and Store DevTools
- **UI Components**: PrimeNG 20.2 with Aura theme
- **HTTP**: Angular HttpClient with auth interceptor
- **Language**: TypeScript 5.9
- **Styling**: SCSS with dark theme variables
- **Testing**: Karma + Jasmine
- **Server**: Express.js 5.1 for SSR

## Prerequisites

- Node.js 20.x or higher
- Angular CLI 20.3.5
- npm 10.x or higher

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd client-angular
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will auto-reload on source changes.

### 4. Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server on port 4200 |
| `npm run build` | Production build |
| `npm run watch` | Dev build with watch mode |
| `npm test` | Run unit tests with Karma |
| `npm run serve:ssr:first-angular` | Run SSR server (requires build first) |

## Project Structure

```
src/
├── app/
│   ├── components/common/        # Reusable UI components (header, sidebar, flashcard, etc.)
│   ├── pages/                    # Page components (signin, dashboard, library, quiz, etc.)
│   ├── layouts/                  # Layout wrappers (auth, main)
│   ├── store/                    # NgRx feature stores (auth, studyset)
│   ├── services/                 # Business logic services (auth, loading, sidebar)
│   ├── guards/                   # Route guards (auth.guard)
│   ├── interceptors/             # HTTP interceptors (auth.interceptor)
│   ├── types/                    # TypeScript interfaces and enums
│   ├── styles/                   # Global SCSS variables and mixins
│   └── app.config.ts             # Application configuration (NgRx, theme, HTTP, etc.)
├── environments/
│   └── environment.ts            # API base URL configuration
└── main.ts                       # Bootstrap file
```

For detailed documentation, see:
- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)
- [Project Roadmap](./docs/project-roadmap.md)

## Architecture Overview

The application follows these key architectural patterns:

**NgRx State Management**: Global app state is divided into feature slices (auth, studyset) with actions, reducers, effects, and selectors.

**Authentication Flow**: User credentials are sent to the API, token is stored in NgRx state and persisted to localStorage via `ngrx-store-localstorage`.

**Protected Routes**: AuthGuard checks for valid token before allowing access to protected pages.

**HTTP Interception**: AuthInterceptor automatically adds Bearer token to all HTTP requests (except public endpoints).

## Configuration

### API Endpoint
Update the API base URL in `src/environments/environment.ts`:
```typescript
export const environment = {
  apiUrl: 'https://server-898671149171.asia-southeast1.run.app'
};
```

### Theme
PrimeNG theme is configured in `app.config.ts` using Aura preset. Customize via:
```typescript
providePrimeNG({
  theme: { preset: Aura }
})
```

## Testing

Run unit tests:
```bash
npm test
```

Tests use Karma test runner and Jasmine framework. Test files are named `*.spec.ts`.

## Documentation Structure

All documentation is maintained in the `docs/` directory:
- **project-overview-pdr.md**: Product vision, features, and requirements
- **codebase-summary.md**: File structure and module organization
- **code-standards.md**: Coding conventions and patterns
- **system-architecture.md**: Architecture diagrams and data flows
- **project-roadmap.md**: Development phases and planned features

## Development Guidelines

See [Code Standards](./docs/code-standards.md) for:
- Component patterns (standalone, signals, inject())
- NgRx patterns and naming conventions
- Service layer patterns
- Template syntax and control flow
- SCSS conventions
- Git workflow and commit messages

## Support

For questions or issues, refer to:
1. Project documentation in `docs/` directory
2. Inline code comments marked with Vietnamese explanation
3. NgRx Store DevTools (available in dev mode)

## License

Proprietary - All rights reserved
