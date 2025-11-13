import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";
import { LoginResponseType } from "../../../../types/login-response.type";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    ]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.invalid) {
      // подсвечиваем ошибки и выводим сообщения
      this.showValidationErrors();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email!, password!, !!rememberMe).subscribe({
      next: (data: LoginResponseType | DefaultResponseType) => {
        let error = null;

        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message;
        }

        const loginResponse = data as LoginResponseType;
        if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
          error = 'Ошибка авторизации';
        }

        if (error) {
          this._snackBar.open(error);
          throw new Error(error);
        }

        this.authService.setToken(loginResponse.accessToken, loginResponse.refreshToken);
        this.authService.userId = loginResponse.userId;
        this._snackBar.open('Вы успешно авторизовались');
        this.router.navigate(['/']);
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка авторизации');
        }
      }
    });
  }

  private showValidationErrors(): void {
    const emailCtrl = this.loginForm.get('email');
    const passwordCtrl = this.loginForm.get('password');

    if (emailCtrl?.hasError('required')) {
      this._snackBar.open('Введите адрес электронной почты');
    } else if (emailCtrl?.hasError('email')) {
      this._snackBar.open('Некорректный формат email',);
    } else if (passwordCtrl?.hasError('required')) {
      this._snackBar.open('Введите пароль');
    } else if (passwordCtrl?.hasError('pattern')) {
      this._snackBar.open('Пароль: минимум 6 символов, заглавные и строчные буквы');
    }

    // подсветим все поля
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }
}
