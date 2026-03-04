import { Component, inject, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Trang chủ', icon: 'pi-home', route: '/', isActive: true },
    { label: 'Thư viện của bạn', icon: 'pi-folder', route: '/library' },
    { label: 'Lịch sử Quiz', icon: 'pi-history', route: '/quiz-history' },
    { label: 'Thông báo', icon: 'pi-bell', route: '/notifications' },
  ];
  sidebarService = inject(SidebarService);
  private document = inject(DOCUMENT);

  @HostListener('window:resize')
  onResize(): void {
    // Close sidebar on desktop resize
    if (this.document.defaultView && this.document.defaultView.innerWidth > 768) {
      this.sidebarService.open();
    }
  }

  onNavClick(item: NavItem): void {
    // Update active state
    this.navItems.forEach(nav => nav.isActive = nav === item);

    // Close sidebar on mobile after navigation
    if (this.document.defaultView && this.document.defaultView.innerWidth <= 768) {
      this.sidebarService.close();
    }
  }

  onBackdropClick(): void {
    this.sidebarService.close();
  }
}

