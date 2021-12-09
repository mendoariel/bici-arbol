import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  passwordRecovery() {
    if (this.form.valid) {
      this.spinner = true;
      this.authService.passwordRecovery({email: this.email.value}).subscribe(
        (res) => {
          console.log(res);
          this.spinner = false;
          this.snackBar.open('Hemos enviado un email, con las intrucciones para recuperar su contraseña', 'Cerrar', {
            duration: 8000, horizontalPosition: 'right', verticalPosition: 'top'});

          this.router.navigate(['public/login']);
        },
        (err) => {
          
          this.spinner = false;
          this.snackBar.open('No se pudo completar la operación', 'Cerrar', {
            duration: 8000, horizontalPosition: 'right', verticalPosition: 'top'});
          console.log(err);
        }
      );
    }
  }

  get email():FormControl { return this.form.get('email') as FormControl }

}
