import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StudySet, User } from '../../types';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import * as ExploreActions from '../../store/explore/explore.actions';
import * as ExploreSelectors from '../../store/explore/explore.selectors';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { StudysetCard } from '../../components/common/studyset-card/studyset-card';
import { StatsCard } from '../../components/common/stats-card/stats-card';
import { EmptyState } from '../../components/common/empty-state/empty-state';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StudysetCard,
    StatsCard,
    EmptyState,
    ButtonModule,
    SkeletonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private store = inject(Store<AppState>);

  user$: Observable<User | null> = this.store.select(AuthSelectors.selectUser);
  studySets$: Observable<StudySet[]> = this.store.select(StudySetSelectors.selectAllStudySets);
  isLoading$: Observable<boolean> = this.store.select(StudySetSelectors.selectIsLoading);

  trending$: Observable<StudySet[]> = this.store.select(ExploreSelectors.selectTrending);
  recent$: Observable<StudySet[]> = this.store.select(ExploreSelectors.selectRecent);
  categories$: Observable<string[]> = this.store.select(ExploreSelectors.selectCategories);
  isTrendingLoading$: Observable<boolean> = this.store.select(
    ExploreSelectors.selectIsTrendingLoading
  );
  isRecentLoading$: Observable<boolean> = this.store.select(
    ExploreSelectors.selectIsRecentLoading
  );

  ngOnInit(): void {
    this.store.dispatch(StudySetActions.loadStudySets({ page: 0, size: 4 }));
    this.store.dispatch(ExploreActions.loadTrending({ page: 0, size: 8 }));
    this.store.dispatch(ExploreActions.loadRecent({ page: 0, size: 8 }));
    this.store.dispatch(ExploreActions.loadCategories());
  }
}
