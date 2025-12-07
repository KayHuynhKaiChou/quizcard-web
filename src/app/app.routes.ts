import { Routes } from '@angular/router';
import { SigninPage } from './pages/signin/signin';
import { MainLayoutComponent } from './layouts/main/main';
import { AuthLayoutComponent } from './layouts/auth/auth';
import { DashboardPage } from './pages/dashboard/dashboard';
import { LibraryComponent } from './pages/library/library';
import { NotificationsComponent } from './pages/notifications/notifications';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'signin',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: SigninPage },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardPage, pathMatch: 'full' },
      { path: 'library', component: LibraryComponent },
      {
        path: 'set/:id',
        loadComponent: () => import('./pages/studyset-detail/studyset-detail').then(m => m.StudySetDetailPage)
      },
      {
        path: 'quiz/:id',
        loadComponent: () => import('./pages/quiz/quiz').then(m => m.QuizPage)
      },
      { path: 'notifications', component: NotificationsComponent },
    ],
    canActivate: [AuthGuard],
  },
];

