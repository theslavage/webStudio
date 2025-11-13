import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LoginResponseType } from "../../../../types/login-response.type";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  // Проверка: все поля заполнены и чекбокс отмечен
  isFormFilled(): boolean {
    const form = this.signupForm.value;
    return !!(form.name && form.email && form.password && form.agree);
  }

  signup(): void {
    // --- Валидация перед отправкой ---
    const controls = this.signupForm.controls;

    if (!controls.name.value) {
      this._snackBar.open('Введите ваше имя');
      return;
    }

    if (!controls.email.value || controls.email.invalid) {
      this._snackBar.open('Введите корректный email');
      return;
    }

    if (!controls.password.value || controls.password.invalid) {
      this._snackBar.open('Пароль: минимум 6 символов, заглавные и строчные буквы');
      return;
    }

    if (!controls.agree.value) {
      this._snackBar.open('Необходимо согласие на обработку персональных данных');
      return;
    }

    // --- Если форма валидна — отправляем запрос ---
    this.authService.signup(
      controls.name.value,
      controls.email.value,
      controls.password.value
    ).subscribe({
      next: (data: LoginResponseType | DefaultResponseType) => {
        let error = null;

        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message;
        }

        const loginResponse = data as LoginResponseType;

        if (!loginResponse.accessToken ||
          !loginResponse.refreshToken ||
          !loginResponse.userId) {
          error = 'Ошибка регистрации';
        }

        if (error) {
          this._snackBar.open(error);
          throw new Error(error);
        }

        this.authService.setToken(loginResponse.accessToken, loginResponse.refreshToken);
        this.authService.userId = loginResponse.userId;
        this._snackBar.open('Вы успешно зарегистрировались');
        this.router.navigate(['/']);
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка регистрации');
        }
      }
    });
  }
}
