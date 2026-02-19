import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
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
    InputTextModule, ButtonModule, PasswordModule, TextareaModule, MessageModule,
    StatsCard,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private fb = inject(FormBuilder);
  private sub = new Subscription();

  user: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  passwordError = signal('');
  profileSaved = signal(false);

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
          this.user = user;
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
}
