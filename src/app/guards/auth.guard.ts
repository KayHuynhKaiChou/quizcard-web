import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, of, take } from 'rxjs';
import { AppState } from '../store/app.state';
import * as AuthSelectors from '../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectToken).pipe(
      take(1),
      map((token) => {
        if (token) {
          return true;
        } else {
          this.router.navigate(['/signin']);
          return false;
        }
      })
    );
  }
}
