import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { localStorageSync } from 'ngrx-store-localstorage';

// Reducers
import { authReducer } from './store/auth/auth.reducer';
import { studySetReducer } from './store/studyset/studyset.reducer';
import { notificationReducer } from './store/notification/notification.reducer';
import { quizReducer } from './store/quiz/quiz.reducer';
import { learningReducer } from './store/learning/learning.reducer';
import { exploreReducer } from './store/explore/explore.reducer';
import { aiReducer } from './store/ai/ai.reducer';

// Effects
import { AuthEffects } from './store/auth/auth.effects';
import { StudySetEffects } from './store/studyset/studyset.effects';
import { NotificationEffects } from './store/notification/notification.effects';
import { QuizEffects } from './store/quiz/quiz.effects';
import { LearningEffects } from './store/learning/learning.effects';
import { ExploreEffects } from './store/explore/explore.effects';
import { AiEffects } from './store/ai/ai.effects';

// LocalStorage sync meta reducer
export function localStorageSyncReducer(reducer: any) {
  if (typeof localStorage === 'undefined') {
    return reducer;
  }

  return localStorageSync({
    keys: ['auth'],
    rehydrate: true,
    storage: localStorage,
    checkStorageAvailability: true,
    syncCondition: (state: any) => {
      return !state.auth?.error && !state.auth?.isLoading;
    },
  })(reducer);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideNoopAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
          cssLayer: false,
        },
      },
      ripple: true,
    }),
    MessageService,
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    // NgRx Store
    provideStore(
      {
        auth: authReducer,
        studySet: studySetReducer,
        notification: notificationReducer,
        quiz: quizReducer,
        learning: learningReducer,
        explore: exploreReducer,
        ai: aiReducer,
      },
      {
        metaReducers: [localStorageSyncReducer],
      }
    ),
    provideEffects([
      AuthEffects,
      StudySetEffects,
      NotificationEffects,
      QuizEffects,
      LearningEffects,
      ExploreEffects,
      AiEffects,
    ]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
