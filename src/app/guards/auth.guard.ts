import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AppState } from '../store/app.state';
import * as AuthSelectors from '../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private store = inject(Store<AppState>);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectToken).pipe(
      take(1),
      map(token => {
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
