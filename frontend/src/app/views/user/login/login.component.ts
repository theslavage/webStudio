import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";
import { LoginResponseType } from "../../../../types/login-response.type";
import { DefaultResponseType } from "../../../../types/default-response.type";
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
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if (this.loginForm.invalid) return;

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email!, password!, !!rememberMe).subscribe({
      next: (data) => {
        let error = null;

        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message;
        }

        const loginResponse = data as LoginResponseType;

        if (!loginResponse.accessToken ||
          !loginResponse.refreshToken ||
          !loginResponse.userId) {
          error = 'Ошибка авторизации';
        }

        if (error) {
          this._snackBar.open(error);
          return;
        }

        this.authService.setToken(loginResponse.accessToken, loginResponse.refreshToken);
        this.authService.userId = loginResponse.userId;
        this._snackBar.open('Вы успешно авторизовались');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this._snackBar.open(err.error?.message || 'Ошибка авторизации');
      }
    });
  }
}
