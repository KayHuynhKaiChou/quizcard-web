import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { authReducer } from '../../store/auth/auth.reducer';
import { SigninPage } from './signin';

describe('SigninPage', () => {
  let component: SigninPage;
  let fixture: ComponentFixture<SigninPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideStore({ auth: authReducer }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
