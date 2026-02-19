import { Component, inject, signal, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'verify-email-sent-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  templateUrl: './verify-email-sent.html',
  styleUrl: './verify-email-sent.scss',
})
export class VerifyEmailSentPage implements OnDestroy {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  pendingEmail$ = this.authService.pendingVerificationEmail$;
  isLoading$ = this.authService.isLoading$;

  cooldown = signal(0);
  private cooldownInterval: ReturnType<typeof setInterval> | null = null;

  resendEmail(): void {
    this.pendingEmail$.pipe(take(1)).subscribe((email) => {
      if (email) {
        this.authService.resendVerification(email);
        this.startCooldown();
      }
    });
  }

  private startCooldown(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cooldown.set(60);
    this.cooldownInterval = setInterval(() => {
      this.cooldown.update((v) => {
        if (v <= 1) {
          clearInterval(this.cooldownInterval!);
          this.cooldownInterval = null;
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) clearInterval(this.cooldownInterval);
  }
}
