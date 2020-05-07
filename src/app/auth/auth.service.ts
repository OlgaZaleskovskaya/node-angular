import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAuthData } from './authData.model';

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;

  constructor(private http: HttpClient) { }

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: IAuthData = { email: email, password: password };
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log("response", response);
      })

  }

  login(email: string, password: string) {
    const authData: IAuthData = { email: email, password: password };
    this.http.post<{ token: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      })

  }

}
