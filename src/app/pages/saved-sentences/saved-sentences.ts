import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SavedSentence } from '../../types';
import { AppState } from '../../store/app.state';
import * as SavedSentenceActions from '../../store/saved-sentence/saved-sentence.actions';
import * as SavedSentenceSelectors from '../../store/saved-sentence/saved-sentence.selectors';
import { EmptyState } from '../../components/common/empty-state/empty-state';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-saved-sentences',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PaginatorModule,
    SkeletonModule,
    ConfirmDialogModule,
    EmptyState,
  ],
  templateUrl: './saved-sentences.html',
  styleUrl: './saved-sentences.scss',
})
export class SavedSentencesPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private confirmationService = inject(ConfirmationService);
  private destroy$ = new Subject<void>();

  readonly pageSize = PAGE_SIZE;

  items = signal<SavedSentence[]>([]);
  currentPage = signal(0);
  totalElements = signal(0);
  isLoading = signal(false);

  ngOnInit(): void {
    this.load(0);

    this.store
      .select(SavedSentenceSelectors.selectSavedSentencesWithPagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.items.set(data.items);
        this.currentPage.set(data.page);
        this.totalElements.set(data.totalElements);

        // Deleting the last row of the last page leaves an empty view; step back.
        if (data.items.length === 0 && data.page > 0) {
          this.load(data.page - 1);
        }
      });

    this.store
      .select(SavedSentenceSelectors.selectIsLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => this.isLoading.set(loading));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(page: number): void {
    this.store.dispatch(
      SavedSentenceActions.loadSavedSentences({ page, size: this.pageSize })
    );
  }

  onPageChange(event: PaginatorState): void {
    this.load(event.page ?? 0);
  }

  confirmDelete(item: SavedSentence): void {
    this.confirmationService.confirm({
      message: 'Xóa câu này?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-trash',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(SavedSentenceActions.deleteSavedSentence({ id: item.id }));
      },
    });
  }

  skeletonItems(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
