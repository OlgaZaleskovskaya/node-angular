import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAuthData } from './authData.model';

@Injectable({ providedIn: "root" })
export class AuthService {

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
    const authData: IAuthData = { email: email, password: password };
    console.log("service", authData);
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log("response", response);
      })

  }

}
