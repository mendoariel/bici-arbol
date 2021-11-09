import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  spinner: boolean = false;
  dontCredentials: boolean = false;
  serviceFailed: boolean = false;
  emailSubscription: Subscription = new Subscription;
  passwordSubscription: Subscription = new Subscription;

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.emailSubscription = this.email.valueChanges.subscribe(
      () => this.dontCredentials = false
    );
    this.passwordSubscription = this.password.valueChanges.subscribe(
      () => this.dontCredentials = false
    );
  }

  ngOnDestroy() {
    if(this.emailSubscription) this.emailSubscription.unsubscribe();
    if(this.passwordSubscription) this.passwordSubscription.unsubscribe();
  }

  login() {
    if (this.form.valid) {
      this.spinner = true;
      this.dontCredentials = false;
      this.authService.login({
        email: this.email.value,
        password: this.password.value
      }).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['../../private/dashboard'])
        },
        (err) => {
          if (err.status === 404) {
            this.dontCredentials = true;
          } else {
            this.serviceFailed = false;
          }
          this.spinner = false;
          console.log(err);
        }
      );
    }
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl
  }


}
