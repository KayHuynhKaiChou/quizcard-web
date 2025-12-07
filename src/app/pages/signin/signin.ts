import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'signin-page',
  imports: [
    CommonModule,
    ButtonModule, 
    InputTextModule, 
    PasswordModule, 
    MessageModule,
    ReactiveFormsModule
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class SigninPage implements OnInit {
  form!: FormGroup;
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  signin() {
    if (this.form.invalid) {
      // Mark all fields as dirty to show errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }

    const { username, password } = this.form.value;

    // Dispatch login action
    this.authService.login({ username, password });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // đây là cách watch sự thay đổi của isAuthenticated$ Observable, giống useEffect trong React
  // subscriptions = new Subscription();
  // this.subscriptions.add(
  //   this.isAuthenticated$.pipe(
  //     filter(isAuth => isAuth === true)
  //   ).subscribe(() => {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Đăng nhập thành công',
  //       detail: 'Chào mừng bạn trở lại!',
  //       life: 3000
  //     });
      
  //     // Navigate to home after 1 second
  //     setTimeout(() => {
  //       this.router.navigate(['/']);
  //     }, 1000);
  //   })
  // );
  // onDestroy => subscriptions.unsubscribe();
}
