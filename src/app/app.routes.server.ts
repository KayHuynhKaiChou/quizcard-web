import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public auth pages - prerender for fast initial load
  { path: 'signin', renderMode: RenderMode.Prerender },
  { path: 'signup', renderMode: RenderMode.Prerender },
  { path: 'verify-email', renderMode: RenderMode.Prerender },
  { path: 'verify-email-sent', renderMode: RenderMode.Prerender },
  { path: 'forgot-password', renderMode: RenderMode.Prerender },
  { path: 'reset-password', renderMode: RenderMode.Prerender },
  // Dynamic SSR routes (with URL params)
  { path: 'set/:id', renderMode: RenderMode.Client },
  { path: 'set/:id/edit', renderMode: RenderMode.Client },
  { path: 'quiz/:id', renderMode: RenderMode.Client },
  // All other routes (protected) - client only, no SSR flash
  { path: '**', renderMode: RenderMode.Client },
];
