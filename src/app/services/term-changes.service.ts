import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StudySetService } from './studyset.service';
import { TermRow } from '../components/common/term-editor/term-editor';

export interface TermSaveResult {
  saved: number;
  failed: number;
}

/**
 * Gom thay đổi thuật ngữ trong trang chỉnh sửa và ghi xuống server khi người dùng bấm lưu.
 *
 * Ghi theo từng thẻ (POST/PUT/DELETE trên đúng thuật ngữ đã bị chạm vào) thay vì gửi cả
 * danh sách. Nhờ vậy trang edit vẫn nạp dần bằng cursor mà không có nguy cơ server hiểu
 * nhầm những thuật ngữ chưa nạp là đã bị xoá.
 *
 * Cung cấp ở cấp component để hàng đợi không dính sang bộ thẻ khác khi điều hướng.
 */
@Injectable()
export class TermChangesService {
  private readonly api = inject(StudySetService);

  /** Số thay đổi sẽ được ghi ở lần lưu kế tiếp */
  readonly pendingCount = signal(0);

  private studySetId: string | null = null;
  /** Dòng đã sửa hoặc mới thêm, gom theo key nên sửa nhiều lần vẫn chỉ tốn 1 request */
  private readonly changed = new Map<string, TermRow>();
  /** Dòng đã xoá; chỉ giữ dòng từng tồn tại trên server vì dòng mới chưa có gì để xoá */
  private readonly removed = new Map<string, TermRow>();

  init(studySetId: string): void {
    this.studySetId = studySetId;
    this.changed.clear();
    this.removed.clear();
    this.pendingCount.set(0);
  }

  markChanged(row: TermRow): void {
    this.changed.set(row.key, row);
    this.syncPendingCount();
  }

  markRemoved(row: TermRow): void {
    this.changed.delete(row.key);
    if (row.id) this.removed.set(row.key, row);
    this.syncPendingCount();
  }

  hasPending(): boolean {
    return this.pendingCount() > 0;
  }

  /** Ghi mọi thay đổi đang chờ. Không bao giờ lỗi ra ngoài: lỗi lẻ được đếm vào `failed`. */
  saveAll(): Observable<TermSaveResult> {
    if (!this.studySetId) return of({ saved: 0, failed: 0 });

    const deletions = [...this.removed.values()].map((row) => this.deleteRow(row));
    const writes = this.savableChanges().map((row) => this.writeRow(row));
    const requests = [...deletions, ...writes];

    // forkJoin trên mảng rỗng hoàn tất mà không phát giá trị nào, nên phải chặn trước
    if (!requests.length) return of({ saved: 0, failed: 0 });

    return forkJoin(requests).pipe(
      map((results) => {
        const saved = results.filter(Boolean).length;
        return { saved, failed: results.length - saved };
      })
    );
  }

  /**
   * Dòng mới chỉ ghi được khi đủ cả thuật ngữ lẫn định nghĩa (server bắt buộc @NotBlank);
   * dòng đã có id thì ghi mọi thay đổi, kể cả khi người dùng vừa xoá trắng một ô.
   */
  private savableChanges(): TermRow[] {
    return [...this.changed.values()].filter(
      (row) => row.id || (row.term.trim() && row.definition.trim())
    );
  }

  private writeRow(row: TermRow): Observable<boolean> {
    const payload = { term: row.term, definition: row.definition };
    const request$ = row.id
      ? this.api.updateTerm(row.id, payload)
      : this.api.addTerm(this.studySetId!, payload);

    return request$.pipe(
      map((saved) => {
        // Gán id server cho dòng vừa tạo để lần lưu sau đi đường PUT thay vì tạo bản trùng
        row.id = saved.id;
        this.changed.delete(row.key);
        this.syncPendingCount();
        return true;
      }),
      catchError(() => of(false))
    );
  }

  private deleteRow(row: TermRow): Observable<boolean> {
    return this.api.deleteTerm(row.id!).pipe(
      map(() => {
        this.removed.delete(row.key);
        this.syncPendingCount();
        return true;
      }),
      catchError(() => of(false))
    );
  }

  private syncPendingCount(): void {
    this.pendingCount.set(this.savableChanges().length + this.removed.size);
  }
}
