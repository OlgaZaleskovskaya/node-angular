import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAuthData } from './authData.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private authStateListener = new Subject<boolean>();
  private tokenTimer: any;
  private isAuthenticated = false;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStateListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: IAuthData = { email: email, password: password };
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(() => this.router.navigate(["/"]),
        error => {
          this.authStateListener.next(false)
        });

  }

  login(email: string, password: string) {
    const authData: IAuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStateListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        };
      }, error => {
        this.authStateListener.next(false);
      });
  };

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  };

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    };
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStateListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);

  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }



}
