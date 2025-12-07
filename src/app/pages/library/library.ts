import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StudySet } from '../../types';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import { StudysetCard } from '../../components/common/studyset-card/studyset-card';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, StudysetCard],
  templateUrl: './library.html',
  styleUrl: './library.scss'
})
export class LibraryComponent implements OnInit {
  private store = inject(Store<AppState>);

  studySets$: Observable<StudySet[]> = this.store.select(StudySetSelectors.selectAllStudySets);
  isLoading$: Observable<boolean> = this.store.select(StudySetSelectors.selectIsLoading);

  ngOnInit(): void {
    this.store.dispatch(StudySetActions.loadStudySets());
  }
}
