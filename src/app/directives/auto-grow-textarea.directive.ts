import { AfterViewInit, Directive, ElementRef, Input, inject } from '@angular/core';

/** Chiều cao 1 dòng (0.875rem * line-height 1.5 ≈ 21px), khớp với .term-input trong SCSS */
export const TEXTAREA_LINE_HEIGHT_PX = 21;
/**
 * Giãn chiều cao textarea vừa đúng nội dung, tối đa `maxRows` dòng rồi mới bật scroll nội bộ.
 * Tách ra thành hàm thuần để component cha có thể gọi hàng loạt (vd: khi container đổi bề rộng).
 *
 * Padding và viền đọc từ computed style thay vì hằng số, để không lệch khi SCSS đổi.
 */
export function autoGrowTextarea(textarea: HTMLTextAreaElement, maxRows: number): void {
  const style = getComputedStyle(textarea);
  const lineHeight = parseFloat(style.lineHeight) || TEXTAREA_LINE_HEIGHT_PX;
  const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const borderY = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  // scrollHeight gồm nội dung + padding nhưng không gồm viền; với box-sizing: border-box
  // thì style.height lại tính cả viền, nên phải cộng bù, nếu không sẽ cụt đúng phần viền.
  const extra = style.boxSizing === 'border-box' ? borderY : 0;
  const maxHeight = lineHeight * maxRows + paddingY + extra;

  textarea.style.height = 'auto';
  const needed = textarea.scrollHeight + extra;
  textarea.style.overflowY = needed > maxHeight ? 'auto' : 'hidden';
  textarea.style.height = Math.min(needed, maxHeight) + 'px';
}

/**
 * Tự giãn chiều cao textarea theo nội dung.
 *
 * Bind giá trị đang hiển thị vào `[appAutoGrow]` để directive giãn lại cả khi nội dung
 * được gán từ code (nạp dữ liệu từ server, load-more), không chỉ khi người dùng gõ.
 * Thiếu bước này thì textarea đứng ở `rows="1"` và `overflow: hidden` cắt mất nội dung
 * nhiều dòng — lỗi chỉ lộ ra trên mobile vì cột hẹp nên chữ xuống dòng.
 */
@Directive({
  selector: 'textarea[appAutoGrow]',
  standalone: true,
  host: { '(input)': 'grow()' },
})
export class AutoGrowTextareaDirective implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);

  /** Số dòng tối đa trước khi textarea tự bật thanh cuộn */
  @Input() autoGrowMaxRows = 4;

  /**
   * Giá trị đang hiển thị. Chỉ dùng để nhận biết nội dung đổi từ bên ngoài;
   * hoãn sang macrotask vì ngModel ghi value vào DOM sau khi input binding chạy.
   */
  @Input() set appAutoGrow(_value: unknown) {
    setTimeout(() => this.grow());
  }

  ngAfterViewInit(): void {
    this.grow();
  }

  grow(): void {
    autoGrowTextarea(this.el.nativeElement, this.autoGrowMaxRows);
  }
}
