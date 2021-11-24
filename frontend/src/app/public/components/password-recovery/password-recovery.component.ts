import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  spinner: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  passwordRecovery() {
    console.log(this.email);
    if (this.form.valid) {
      this.spinner = true;
      this.authService.passwordRecovery({email: this.email.value}).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['../login'])
        },
        (err) => {
          
          this.spinner = false;
          console.log(err);
        }
      );
    }
  }

  get email():FormControl { return this.form.get('email') as FormControl }

}
