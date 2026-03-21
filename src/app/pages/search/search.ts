import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, distinctUntilChanged, map } from 'rxjs';
import { StudySet } from '../../types';
import { AppState } from '../../store/app.state';
import * as ExploreActions from '../../store/explore/explore.actions';
import * as ExploreSelectors from '../../store/explore/explore.selectors';
import { StudysetCard } from '../../components/common/studyset-card/studyset-card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, StudysetCard, SkeletonModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  searchQuery = '';
  results$: Observable<StudySet[]> = this.store.select(ExploreSelectors.selectSearchResults);
  isLoading$: Observable<boolean> = this.store.select(ExploreSelectors.selectIsLoading);
  error$: Observable<string | null> = this.store.select(ExploreSelectors.selectError);

  myResults$: Observable<StudySet[]> = this.results$.pipe(
    map((sets) => sets.filter((s) => s.isOwner))
  );
  otherResults$: Observable<StudySet[]> = this.results$.pipe(
    map((sets) => sets.filter((s) => !s.isOwner))
  );

  skeletons = Array(8).fill(0);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((params) => {
        const query = params.get('query') ?? '';
        this.searchQuery = query;
        if (query.trim()) {
          this.store.dispatch(ExploreActions.searchStudySets({ query }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
