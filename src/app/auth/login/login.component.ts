import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService) {
  }
  onLogin(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.authService.login(f.value.email, f.value.password);
  }

}
