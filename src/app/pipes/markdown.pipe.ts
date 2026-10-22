import { Pipe, PipeTransform, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    try {
      const rawHtml = marked.parse(value) as string;
      const cleanHtml = this.isBrowser ? DOMPurify.sanitize(rawHtml) : rawHtml;
      return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
    } catch (e) {
      // Fallback to text if parsing fails
      return this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(value));
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
