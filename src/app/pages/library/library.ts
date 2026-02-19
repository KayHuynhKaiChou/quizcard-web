import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StudySet } from '../../types';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import { StudysetCard } from '../../components/common/studyset-card/studyset-card';
import { SearchToolbar } from '../../components/common/search-toolbar/search-toolbar';
import { ViewToggle } from '../../components/common/view-toggle/view-toggle';
import { EmptyState } from '../../components/common/empty-state/empty-state';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StudysetCard,
    SearchToolbar,
    ViewToggle,
    EmptyState,
    ButtonModule,
    SkeletonModule,
  ],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class LibraryComponent implements OnInit {
  private store = inject(Store<AppState>);

  studySets$: Observable<StudySet[]> = this.store.select(StudySetSelectors.selectAllStudySets);
  isLoading$: Observable<boolean> = this.store.select(StudySetSelectors.selectIsLoading);

  searchQuery = signal('');
  viewMode = signal<'grid' | 'list'>('grid');

  ngOnInit(): void {
    this.store.dispatch(StudySetActions.loadStudySets({ page: 0, size: 50 }));
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onViewChange(view: 'grid' | 'list'): void {
    this.viewMode.set(view);
  }

  filterStudySets(studySets: StudySet[]): StudySet[] {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return studySets;
    return studySets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q))
    );
  }
}
