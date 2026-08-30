import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TermEditor, TermEditorMode, TermRow } from '../term-editor/term-editor';
import { StudySetDetail } from '../../../types';
import { Visibility } from '../../../types/enum';

export interface StudySetFormData {
  title: string;
  description: string;
  visibility: Visibility;
  terms: { term: string; definition: string }[];
}

@Component({
  selector: 'app-study-set-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    TermEditor,
  ],
  templateUrl: './study-set-form.html',
  styleUrl: './study-set-form.scss',
})
export class StudySetForm implements OnInit {
  @Input() initialData: StudySetDetail | null = null;
  @Input() submitLabel = 'Tạo bộ thẻ';
  @Input() isSubmitting = false;

  /** 'edit' bật nút nạp thêm và theo dõi thay đổi thuật ngữ chờ lưu */
  @Input() mode: TermEditorMode = 'create';

  /**
   * Thuật ngữ đã nạp, do trang cha lấy từ store. Dùng input riêng thay vì đọc
   * initialData.terms để tham chiếu mảng ổn định — TermEditor dựa vào đó để biết
   * khi nào thực sự có dữ liệu mới cần gộp.
   */
  @Input() termRows: TermRow[] = [];

  /** Tổng số thuật ngữ của bộ thẻ (kể cả phần chưa nạp) */
  @Input() totalTermCount = 0;
  @Input() hasMoreTerms = false;
  @Input() isLoadingMoreTerms = false;

  /** Số thay đổi thuật ngữ chưa ghi xuống server */
  @Input() pendingTermChanges = 0;

  /** Đích của nút "Quay lại" trên thanh footer; chỉ dùng ở mode 'edit' */
  @Input() backUrl: string | null = null;

  @Output() formSubmit = new EventEmitter<StudySetFormData>();
  @Output() termRowChanged = new EventEmitter<TermRow>();
  @Output() termRowRemoved = new EventEmitter<TermRow>();
  @Output() loadMoreTerms = new EventEmitter<void>();

  title = '';
  description = '';
  visibility: Visibility = Visibility.PUBLIC;
  terms: TermRow[] = [];

  visibilityOptions = [
    { label: 'Công khai', value: Visibility.PUBLIC },
    { label: 'Riêng tư', value: Visibility.PRIVATE },
  ];

  ngOnInit(): void {
    if (this.initialData) {
      this.title = this.initialData.title;
      this.description = this.initialData.description || '';
      this.visibility = this.initialData.visibility;
    }
  }

  onTermsChange(rows: TermRow[]): void {
    this.terms = rows;
  }

  onSubmit(): void {
    if (!this.title.trim()) return;
    const validTerms = this.terms.filter((t) => t.term.trim() && t.definition.trim());
    this.formSubmit.emit({
      title: this.title.trim(),
      description: this.description.trim(),
      visibility: this.visibility,
      terms: validTerms,
    });
  }
}
