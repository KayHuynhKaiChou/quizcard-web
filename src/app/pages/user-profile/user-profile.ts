import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as UserProfileActions from '../../store/user-profile/user-profile.actions';
import * as UserProfileSelectors from '../../store/user-profile/user-profile.selectors';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { StudysetCard } from '../../components/common/studyset-card/studyset-card';
import { StatsCard } from '../../components/common/stats-card/stats-card';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, StudysetCard, StatsCard],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfilePage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sub = new Subscription();

  profile$ = this.store.select(UserProfileSelectors.selectUserProfile);
  studySets$ = this.store.select(UserProfileSelectors.selectUserStudySets);
  isLoading$ = this.store.select(UserProfileSelectors.selectIsLoading);
  isStudySetsLoading$ = this.store.select(UserProfileSelectors.selectIsStudySetsLoading);
  totalPages$ = this.store.select(UserProfileSelectors.selectStudySetsTotalPages);
  currentPage$ = this.store.select(UserProfileSelectors.selectStudySetsPage);
  error$ = this.store.select(UserProfileSelectors.selectError);

  private userId = '';
  currentPage = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.sub.add(
      this.route.paramMap.subscribe((params) => {
        const userId = params.get('id');
        if (!userId) return;
        this.userId = userId;

        // Redirect to own profile if viewing self
        const currentUserId = this.store.select(AuthSelectors.selectUserId);
        this.sub.add(
          currentUserId.subscribe((id) => {
            if (id && id === userId) {
              this.router.navigate(['/profile']);
            }
          })
        );

        this.store.dispatch(UserProfileActions.loadUserProfile({ userId }));
        this.store.dispatch(UserProfileActions.loadUserStudySets({ userId, page: 0, size: 20 }));
      })
    );

    this.sub.add(
      this.store.select(UserProfileSelectors.selectStudySetsPage).subscribe((p) => {
        this.currentPage = p;
      })
    );

    this.sub.add(
      this.store.select(UserProfileSelectors.selectStudySetsTotalPages).subscribe((t) => {
        this.totalPages = t;
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(UserProfileActions.clearUserProfile());
    this.sub.unsubscribe();
  }

  loadMore(): void {
    const nextPage = this.currentPage + 1;
    this.store.dispatch(
      UserProfileActions.loadUserStudySets({ userId: this.userId, page: nextPage, size: 20 })
    );
  }

  get hasMore(): boolean {
    return this.currentPage < this.totalPages - 1;
  }
}
