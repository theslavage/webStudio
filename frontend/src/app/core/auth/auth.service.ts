import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { DefaultResponseType } from "../../../types/default-response.type";
import { LoginResponseType } from "../../../types/login-response.type";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey = 'accessToken';
  public refreshTokenKey = 'refreshToken';
  public userIdKey = 'userId';
  public userNameKey = 'userName';

  public isLogged$ = new Subject<boolean>();
  public userName$ = new BehaviorSubject<string | null>(localStorage.getItem(this.userNameKey));

  private isLogged = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  // === Вход ===
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    }).pipe(
      tap((res: any) => {
        if (!res?.error) {
          this.setToken(res.accessToken, res.refreshToken);
          this.userId = res.userId;
          this.fetchUserName();
          this.snackBar.open(' Вы успешно вошли в систему');
        }
      })
    );
  }
  // Выход
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password,
    }).pipe(
      tap((res: any) => {
        if (!res?.error) {
          this.setToken(res.accessToken, res.refreshToken);
          this.userId = res.userId;
          this.fetchUserName();
          this.snackBar.open(' Вы успешно зарегистрировались');
        }
      })
    );
  }

  // === Получаем имя пользователя ===
  private fetchUserName(): void {
    const accessToken = localStorage.getItem(this.accessTokenKey);
    if (!accessToken) return;

    this.http.get<any>(environment.api + 'users', {
      headers: { 'x-auth': accessToken }
    }).subscribe({
      next: (user) => {
        if (user?.name) {
          localStorage.setItem(this.userNameKey, user.name);
          this.userName$.next(user.name);
        }
      },
      error: () => {
        this.userName$.next(null);
      }
    });
  }

  // === Выход (через POST /api/logout) ===
  logout(): void {
    const { accessToken, refreshToken } = this.getTokens();

    // если токенов нет — просто локально завершаем выход
    if (!refreshToken) {
      this.finishLogout();
      this.snackBar.open('👋 Вы успешно вышли из системы');
      return;
    }

    this.http.post(`${environment.api}logout`, { refreshToken }).subscribe({
      next: () => {
        this.finishLogout();
        this.snackBar.open('👋 Вы успешно вышли из системы');
      },
      error: (err) => {
        console.error('Ошибка при logout:', err);
        // даже если сервер вернул ошибку — сессия локально сбрасывается
        this.finishLogout();
        this.snackBar.open('⚠️ Ошибка выхода, но сессия сброшена');
      }
    });
  }

  private finishLogout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userNameKey);
    this.userId = null;
    this.isLogged = false;
    this.isLogged$.next(false);
    this.userName$.next(null);
  }
  // === Методы работы с токенами ===
  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  public setToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) localStorage.setItem(this.userIdKey, id);
    else localStorage.removeItem(this.userIdKey);
  }
}
