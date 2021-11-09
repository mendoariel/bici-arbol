 import { Component } from '@angular/core';
import { AuthService } from './public/services/auth-service/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bici - Arbol';

  constructor(private authService: AuthService) {}

  isLogin() {
    if(this.authService.isLogin()) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.authService.logout()
  }
}
