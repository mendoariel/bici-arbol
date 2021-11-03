 import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Test, TestService } from './services/test-service/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bici - Arbol';

  testValue: Observable<Test> = this.serviceTest.getTest();

  constructor(private serviceTest: TestService) {}
}
