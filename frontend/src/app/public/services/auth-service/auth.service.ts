import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginResponseI } from 'src/app/model/login-response.interface';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar,
    private router: Router) {}

  login(user: UserI): Observable<any> {
    return this.http.post<any>('api/users/login', user).pipe(
      tap((res: LoginResponseI) => {
          localStorage.setItem('bici-arbol_app', res.access_token)
        }),
      tap(() => this.snackBar.open('Login Successfull', 'Close login', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  passwordRecovery(user: UserI): Observable<any> {
    return this.http.post('api/users/password-recovery', user);
  }

  isLogin() {
    if(localStorage.getItem('bici-arbol_app')) {
      return true;
    } else {
      return false
    }
  }

  logout() {
    localStorage.removeItem('bici-arbol_app');
    this.router.navigate(['']);
  }
}
