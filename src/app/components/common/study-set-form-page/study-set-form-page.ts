import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { AiUsageResponse } from '../../../types';

export type StudySetFormPageMode = 'create' | 'edit';

@Component({
    selector: 'app-study-set-form-page',
    standalone: true,
    imports: [CommonModule, RouterModule, TabsModule, TooltipModule],
    templateUrl: './study-set-form-page.html',
    styleUrl: './study-set-form-page.scss',
})
export class StudySetFormPage {
    /** Tiêu đề trang (h1) */
    @Input() pageTitle = '';

    /** Mô tả nhỏ bên dưới tiêu đề */
    @Input() pageSubtitle = '';

    /** Nhãn của manual tab */
    @Input() manualTabLabel = 'Thủ công';

    /** Chế độ: 'create' hiển thị cả AI tab, 'edit' chỉ có manual tab */
    @Input() mode: StudySetFormPageMode = 'create';

    /** URL nút back (nếu có sẽ hiển thị nút quay lại) */
    @Input() backUrl: string | null = null;

    /** Dữ liệu usage AI – chỉ dùng khi mode = 'create' */
    @Input() aiUsage: AiUsageResponse | null = null;

    /** Tab hiện tại đang active */
    activeTab = signal<'manual' | 'ai'>('manual');

    get aiDisabled(): boolean {
        return (this.aiUsage?.remaining ?? 1) === 0;
    }

    get aiTooltip(): string {
        return this.aiDisabled ? 'Bạn đã hết lượt tạo bằng AI hôm nay' : '';
    }
}
