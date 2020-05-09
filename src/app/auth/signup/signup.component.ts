import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;
  constructor(public authService: AuthService) {

  }
  onSignup(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(f.value.email, f.value.password);
  }
}
