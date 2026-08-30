import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AutoGrowTextareaDirective, autoGrowTextarea } from '../../../directives/auto-grow-textarea.directive';

/** Số dòng tối đa của một ô nhập trước khi bật thanh cuộn nội bộ */
export const TERM_INPUT_MAX_ROWS = 4;

export interface TermRow {
  /** Khoá ổn định dùng cho @for track và hàng đợi autosave */
  key: string;
  /** Id trên server; chưa có nghĩa là dòng chưa từng được lưu */
  id?: string;
  term: string;
  definition: string;
}

export type TermEditorMode = 'create' | 'edit';

let localRowCounter = 0;

/** Khoá tạm cho dòng người dùng vừa thêm, thay bằng id server sau khi lưu thành công */
function nextLocalKey(): string {
  return `local-${++localRowCounter}`;
}

function emptyRow(): TermRow {
  return { key: nextLocalKey(), term: '', definition: '' };
}

@Component({
  selector: 'app-term-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TextareaModule, ButtonModule, AutoGrowTextareaDirective],
  templateUrl: './term-editor.html',
  styleUrl: './term-editor.scss',
})
export class TermEditor implements AfterViewInit, OnDestroy {
  readonly maxRows = TERM_INPUT_MAX_ROWS;

  /** 'create' bắt đầu bằng 2 dòng trống; 'edit' nạp dữ liệu sẵn có và bật nút nạp thêm */
  @Input() mode: TermEditorMode = 'create';

  /** Tổng số thuật ngữ của bộ thẻ, để hiện "đang xem X / N" */
  @Input() totalCount = 0;

  /** Còn thuật ngữ chưa nạp hay không (từ cursor page của store) */
  @Input() hasMore = false;

  @Input() isLoadingMore = false;

  /**
   * Dữ liệu từ server. Mỗi lần load-more sẽ nhận mảng dài hơn; component gộp thêm phần mới
   * thay vì thay thế toàn bộ, để không xoá mất nội dung người dùng đang gõ dở.
   */
  @Input() set initialTerms(value: TermRow[] | null | undefined) {
    if (!value?.length || value === this.lastIncoming) return;
    this.lastIncoming = value;
    this.mergeIncoming(value);
  }

  /** Toàn bộ danh sách — trang tạo mới dùng để gom vào một request duy nhất */
  @Output() termsChange = new EventEmitter<TermRow[]>();

  /** Một dòng vừa đổi nội dung — trang chỉnh sửa dùng để gom vào hàng đợi chờ lưu */
  @Output() rowChanged = new EventEmitter<TermRow>();

  /** Một dòng vừa bị xoá */
  @Output() rowRemoved = new EventEmitter<TermRow>();

  @Output() loadMore = new EventEmitter<void>();

  @ViewChild('termList') private termListRef?: ElementRef<HTMLElement>;

  rows = signal<TermRow[]>([emptyRow(), emptyRow()]);

  private lastIncoming: TermRow[] | null = null;
  /** Khoá đã xoá, để lần merge sau không nạp lại chúng từ dữ liệu store còn cũ */
  private readonly removedKeys = new Set<string>();
  private removedSavedCount = 0;
  private listObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    // Bề rộng ô nhập đổi khi layout chuyển giữa 2 cột (desktop) và 1 cột (mobile),
    // làm nội dung xuống dòng khác đi nên phải tính lại chiều cao. Một observer cho cả
    // danh sách thay vì mỗi ô một listener.
    const list = this.termListRef?.nativeElement;
    if (!list || typeof ResizeObserver === 'undefined') return;

    this.listObserver = new ResizeObserver(() => this.growAllInputs());
    this.listObserver.observe(list);
  }

  ngOnDestroy(): void {
    this.listObserver?.disconnect();
  }

  /** Tổng hiển thị: trừ đi những dòng vừa xoá, và không bao giờ nhỏ hơn số dòng đang có */
  get displayTotal(): number {
    return Math.max(this.rows().length, this.totalCount - this.removedSavedCount);
  }

  /**
   * Trang tạo mới giữ lại 2 dòng đầu để form không rỗng hoàn toàn;
   * trang chỉnh sửa cho xoá mọi dòng, chỉ chặn khi còn đúng 1 dòng cuối.
   */
  canRemove(index: number): boolean {
    return this.mode === 'edit' ? this.rows().length > 1 : index >= 2;
  }

  addRow(): void {
    this.rows.update((rows) => [...rows, emptyRow()]);
    this.emitChange();
  }

  removeRow(index: number): void {
    const row = this.rows()[index];
    if (!row || !this.canRemove(index)) return;

    this.removedKeys.add(row.key);
    if (row.id) this.removedSavedCount++;

    this.rows.update((rows) => rows.filter((_, i) => i !== index));
    this.rowRemoved.emit(row);
    this.emitChange();
  }

  onFieldChange(row: TermRow): void {
    this.rowChanged.emit(row);
    this.emitChange();
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  trackByKey(_index: number, row: TermRow): string {
    return row.key;
  }

  /**
   * Gộp dữ liệu server vào danh sách đang hiển thị:
   * giữ nguyên nội dung các dòng đã có trên UI, chỉ thêm dòng thật sự mới vào cuối,
   * và đẩy các dòng người dùng tự thêm xuống dưới cùng cho đúng thứ tự nhìn thấy.
   */
  private mergeIncoming(incoming: TermRow[]): void {
    this.rows.update((current) => {
      const fromServer = current.filter((row) => row.id);
      const addedLocally = current.filter((row) => !row.id);
      const knownKeys = new Set(fromServer.map((row) => row.key));

      const appended = incoming.filter((row) => !knownKeys.has(row.key) && !this.removedKeys.has(row.key));

      // Bỏ 2 dòng trống mặc định khi đã có dữ liệu thật để danh sách không lệch
      const keptLocal = addedLocally.filter((row) => row.term.trim() || row.definition.trim());

      return [...fromServer, ...appended, ...keptLocal];
    });
    this.emitChange();
  }

  private growAllInputs(): void {
    const inputs = this.termListRef?.nativeElement.querySelectorAll<HTMLTextAreaElement>('textarea');
    inputs?.forEach((input) => autoGrowTextarea(input, this.maxRows));
  }

  private emitChange(): void {
    this.termsChange.emit(this.rows());
  }
}
