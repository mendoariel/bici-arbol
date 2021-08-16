import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  create(user: UserI):Observable<UserI> {
    return this.http.post<UserI>('api/users', user).pipe(
       tap((createdUser: UserI) => this.snackBar.open(`User ${createdUser.username} created succesfully`, 'Close', {
         duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
       })),
       catchError(e => {
         this.snackBar.open(`User could not be created, due to: ${e.error.message}`, 'Close', {
           duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
         })
         return throwError(e)
       })
    ); 
  }
}
