import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(authStatus => {
this.isLoading = false;
    });
  };

  onSignup(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(f.value.email, f.value.password);
  };

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
