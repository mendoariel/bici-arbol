import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { RegisterComponent } from './components/register/register.component';
import { WellcomeComponent } from './components/wellcome/wellcome.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'wellcome',
    component: WellcomeComponent
  },
  {
    path: 'password-recovery',
    component: PasswordRecoveryComponent
  },
  {
    path: 'new-password',
    component: NewPasswordComponent
  },
  {
    path: 'password-recovery',
    component: PasswordRecoveryComponent
  },
  {
    path: '**',
    redirectTo: 'wellcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
