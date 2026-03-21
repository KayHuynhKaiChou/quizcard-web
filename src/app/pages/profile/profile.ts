import { Component, OnInit, OnDestroy, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { AppState } from '../../store/app.state';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { User } from '../../types';
import { StatsCard } from '../../components/common/stats-card/stats-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    InputTextModule, ButtonModule, TextareaModule, MessageModule,
    DialogModule, DividerModule, TooltipModule,
    StatsCard,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private sub = new Subscription();

  user = signal<User | null>(null);
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  passwordError = signal('');
  profileSaved = signal(false);

  showOldPw = signal(false);
  showNewPw = signal(false);
  showConfirmPw = signal(false);

  // Avatar dialog state
  selectedFile = signal<File | null>(null);
  isAvatarDialogVisible = signal(false);

  localPreviewUrl = computed(() => {
    const file = this.selectedFile();
    if (!file || !isPlatformBrowser(this.platformId)) return null;
    return URL.createObjectURL(file);
  });

  avatarPreviewUrl = computed(() => {
    return this.localPreviewUrl() || this.user()?.avatarUrl || 'https://i.pravatar.cc/150?img=36';
  });

  private readonly STYLES = [
    { style: 'avataaars', bg: '&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc' },
    { style: 'lorelei', bg: '&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc' },
    { style: 'bottts', bg: '&backgroundColor=b6e3f4,c0aede,d1d4f9' },
    { style: 'pixel-art', bg: '' },
    { style: 'thumbs', bg: '&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc' },
    { style: 'fun-emoji', bg: '' },
    { style: 'micah', bg: '&backgroundColor=b6e3f4,c0aede,d1d4f9' },
    { style: 'shapes', bg: '' },
  ];

  avatarPresets = signal(this.generatePresets());

  private generatePresets(): { label: string; url: string }[] {
    return Array.from({ length: 12 }, (_, i) => {
      const s = this.STYLES[i % this.STYLES.length];
      const seed = Math.random().toString(36).slice(2, 9);
      return { label: `Avatar ${i + 1}`, url: `https://api.dicebear.com/9.x/${s.style}/svg?seed=${seed}${s.bg}` };
    });
  }

  refreshPresets(): void {
    this.avatarPresets.set(this.generatePresets());
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      bio: [''],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });

    this.sub.add(
      this.store.select(AuthSelectors.selectUser).subscribe((user) => {
        if (user) {
          this.user.set(user);
          this.profileForm.patchValue({
            displayName: user.displayName,
            bio: user.bio || '',
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const { displayName, bio } = this.profileForm.value;
    this.store.dispatch(AuthActions.updateProfile({ data: { displayName, bio } }));
    this.profileSaved.set(true);
    setTimeout(() => this.profileSaved.set(false), 3000);
  }

  changePassword(): void {
    this.passwordError.set('');
    if (this.passwordForm.invalid) return;
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordError.set('Mật khẩu xác nhận không khớp');
      return;
    }
    this.store.dispatch(AuthActions.changePassword({ oldPassword, newPassword }));
    this.passwordForm.reset();
  }

  openAvatarDialog(): void {
    this.selectedFile.set(null);
    this.isAvatarDialogVisible.set(true);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile.set(input.files[0]);
    }
  }

  uploadAvatar(): void {
    const file = this.selectedFile();
    if (!file) return;
    this.store.dispatch(AuthActions.uploadAvatar({ file }));
    this.isAvatarDialogVisible.set(false);
    this.selectedFile.set(null);
  }

  selectPresetAvatar(url: string): void {
    this.store.dispatch(AuthActions.updateProfile({ data: { avatarUrl: url } }));
    this.isAvatarDialogVisible.set(false);
  }
}
