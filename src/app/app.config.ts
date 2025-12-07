import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideStore, MetaReducer } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { studySetReducer } from './store/studyset/studyset.reducer';
import { StudySetEffects } from './store/studyset/studyset.effects';
import { localStorageSync } from 'ngrx-store-localstorage';

// LocalStorage sync meta reducer - tự động persist/rehydrate
export function localStorageSyncReducer(reducer: any) {
  // Check if we're in browser environment (fix SSR issue)
  if (typeof localStorage === 'undefined') {
    // Return original reducer without sync for SSR
    return reducer;
  }
  
  return localStorageSync({
    keys: ['auth'], // Only persist auth slice
    rehydrate: true, // Load from localStorage on app start
    storage: localStorage,
    checkStorageAvailability: true,
    // Only sync when no error and not loading
    syncCondition: (state: any) => {
      return !state.auth?.error && !state.auth?.isLoading;
    }
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
        preset: Aura
      },
      ripple: true
    }),
    MessageService,
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    // NgRx Store Configuration with localStorage persistence
    provideStore({
      auth: authReducer,
      studySet: studySetReducer
    }, {
      metaReducers: [localStorageSyncReducer]
    }),
    provideEffects([AuthEffects, StudySetEffects]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false, // Set to true in production
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
