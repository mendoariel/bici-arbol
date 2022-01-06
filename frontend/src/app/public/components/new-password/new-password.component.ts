import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-new-passwordConfirm',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  spinner: boolean = false;
  token: string = '';
  userid: string = '';

  form: FormGroup = new FormGroup({ 
    password: new FormControl('', [Validators.required]), 
    passwordConfirm: new FormControl('', [Validators.required])
  })

  constructor(
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                private snackBar: MatSnackBar,
                private router: Router,
              ) { }

  ngOnInit(): void {
    this.catchParameter();
    setTimeout(() => {
      this.password.setValue('');
      this.passwordConfirm.setValue('');
    },1000);
  }

  catchParameter() {
    this.token = this.activatedRoute.snapshot.queryParams.token;
    this.userid = this.activatedRoute.snapshot.queryParams.userid;
  }
  
  newPassword() {
    if (this.form.valid) {
      this.spinner = true;
      this.authService.newPassword(this.token, Number(this.userid), this.password.value).subscribe(
        (res) => {
          console.log(res);
          this.spinner = false;
          this.snackBar.open('Contraseña cambiada con éxito', 'Cerrar', {
            duration: 4000, horizontalPosition: 'right', verticalPosition: 'top'});

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

  get password():FormControl { return this.form.get('password') as FormControl }
  get passwordConfirm():FormControl { return this.form.get('passwordConfirm') as FormControl }

}
