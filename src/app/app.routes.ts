import { Routes } from '@angular/router';
import { SigninPage } from './pages/signin/signin';
import { SignupPage } from './pages/signup/signup';
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
    path: 'signup',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: SignupPage },
    ],
  },
  {
    path: 'verify-email-sent',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/verify-email-sent/verify-email-sent').then(
            (m) => m.VerifyEmailSentPage
          ),
      },
    ],
  },
  {
    path: 'verify-email',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/verify-email/verify-email').then((m) => m.VerifyEmailPage),
      },
    ],
  },
  {
    path: 'forgot-password',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage),
      },
    ],
  },
  {
    path: 'reset-password',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/reset-password/reset-password').then((m) => m.ResetPasswordPage),
      },
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
      {
        path: 'create-set',
        loadComponent: () =>
          import('./pages/create-studyset/create-studyset').then((m) => m.CreateStudySetPage),
      },
      {
        path: 'set/:id/edit',
        loadComponent: () =>
          import('./pages/edit-studyset/edit-studyset').then((m) => m.EditStudySetPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then((m) => m.ProfilePage),
      },
      {
        path: 'ai-generate',
        loadComponent: () =>
          import('./pages/ai-generate/ai-generate').then((m) => m.AiGeneratePage),
      },
      { path: 'notifications', component: NotificationsComponent },
    ],
    canActivate: [AuthGuard],
  },
];

