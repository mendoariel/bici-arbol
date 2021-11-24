import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



import { ReactiveFormsModule } from '@angular/forms';
import { WellcomeComponent } from './components/wellcome/wellcome.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    WellcomeComponent,
    PasswordRecoveryComponent

  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class PublicModule { }
