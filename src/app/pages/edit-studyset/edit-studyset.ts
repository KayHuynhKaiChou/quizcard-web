import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription, take } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as StudySetActions from '../../store/studyset/studyset.actions';
import * as StudySetSelectors from '../../store/studyset/studyset.selectors';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { StudySetFormPage } from '../../components/common/study-set-form-page/study-set-form-page';
import { StudySetForm, StudySetFormData } from '../../components/common/study-set-form/study-set-form';
import { TermRow } from '../../components/common/term-editor/term-editor';
import { TermChangesService } from '../../services/term-changes.service';
import { StudySetDetail, UpdateStudySetRequest } from '../../types';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-studyset',
  standalone: true,
  imports: [CommonModule, StudySetFormPage, StudySetForm],
  templateUrl: './edit-studyset.html',
  styleUrl: './edit-studyset.scss',
  // Cấp component để hàng đợi thay đổi không dính sang bộ thẻ khác khi điều hướng
  providers: [TermChangesService],
  host: { '(window:beforeunload)': 'onBeforeUnload($event)' },
})
export class EditStudySetPage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actions$ = inject(Actions);
  private messageService = inject(MessageService);
  private sub = new Subscription();

  readonly termChanges = inject(TermChangesService);

  studySet: StudySetDetail | null = null;
  isLoading = signal(true);
  isSubmitting = signal(false);

  /** Thuật ngữ đã nạp, ánh xạ từ store. Chỉ đổi tham chiếu khi store thực sự phát dữ liệu mới. */
  termRows = signal<TermRow[]>([]);
  totalTermCount = signal(0);
  hasMoreTerms = signal(false);
  isLoadingMoreTerms = signal(false);

  studySetId: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.studySetId = id;
    if (id) {
      this.termChanges.init(id);
      this.store.dispatch(StudySetActions.loadStudySetById({ id }));
    }

    // Keep studySet up-to-date as store emits (metadata first, then with terms)
    this.sub.add(
      this.store.select(StudySetSelectors.selectSelectedStudySet).subscribe((ss) => {
        if (ss) {
          this.studySet = ss;
          this.totalTermCount.set(ss.termsCount);
          this.store.select(AuthSelectors.selectUser).pipe(take(1)).subscribe(user => {
            if (user && ss.userId !== user.id) {
              this.router.navigate(['/set', ss.id]);
            }
          });
        }
      })
    );

    this.sub.add(
      this.store.select(StudySetSelectors.selectSelectedTerms).subscribe((terms) => {
        this.termRows.set(
          terms.map((t) => ({ key: t.id, id: t.id, term: t.term, definition: t.definition }))
        );
      })
    );

    this.sub.add(
      this.store
        .select(StudySetSelectors.selectHasMoreTerms)
        .subscribe((hasMore) => this.hasMoreTerms.set(hasMore))
    );

    this.sub.add(
      this.store
        .select(StudySetSelectors.selectIsLoadingTerms)
        .subscribe((loading) => this.isLoadingMoreTerms.set(loading))
    );

    // Show form only after terms are loaded so TermEditor initializes with real data
    this.sub.add(
      this.actions$.pipe(
        ofType(StudySetActions.loadStudySetTermsSuccess, StudySetActions.loadStudySetTermsFailure)
      ).subscribe(() => this.isLoading.set(false))
    );

    this.sub.add(
      this.actions$
        .pipe(ofType(StudySetActions.updateStudySetSuccess, StudySetActions.updateStudySetFailure))
        .subscribe(() => this.isSubmitting.set(false))
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /** Nạp thêm một trang thuật ngữ, dùng lại cursor pagination sẵn có của store. */
  onLoadMoreTerms(): void {
    if (!this.studySetId || this.isLoadingMoreTerms()) return;

    this.store
      .select(StudySetSelectors.selectTermsCursor)
      .pipe(take(1))
      .subscribe((cursor) => {
        this.store.dispatch(
          StudySetActions.loadStudySetTerms({ id: this.studySetId!, cursor: cursor ?? undefined })
        );
      });
  }

  onTermRowChanged(row: TermRow): void {
    this.termChanges.markChanged(row);
  }

  onTermRowRemoved(row: TermRow): void {
    this.termChanges.markRemoved(row);
  }

  /** Cảnh báo khi rời trang lúc còn thay đổi chưa lưu. */
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.termChanges.hasPending()) event.preventDefault();
  }

  /**
   * Ghi thuật ngữ đã chỉnh trước, rồi mới cập nhật thông tin chung.
   * Thứ tự này để lần tải lại sau khi lưu thành công đọc được đúng số thuật ngữ mới.
   */
  onFormSubmit(data: StudySetFormData): void {
    if (!this.studySet) return;
    this.isSubmitting.set(true);

    const request: UpdateStudySetRequest = {
      title: data.title,
      description: data.description || undefined,
      visibility: data.visibility,
    };

    this.sub.add(
      this.termChanges.saveAll().subscribe((result) => {
        if (result.failed > 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: `${result.failed} thuật ngữ lưu thất bại`,
          });
        }
        this.store.dispatch(
          StudySetActions.updateStudySet({ id: this.studySet!.id, data: request })
        );
      })
    );
  }
}
