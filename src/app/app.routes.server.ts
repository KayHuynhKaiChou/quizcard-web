import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'set/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'set/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'quiz/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
