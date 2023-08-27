import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "src/app/auth/forgot-password/forgot-password.component";
import { LoginComponent } from "src/app/auth/login/login.component";
import { RegisterComponent } from "src/app/auth/register/register.component";


const routes:Routes = [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'forgot-password', component: ForgotPasswordComponent},
      {
        path: '**',
        redirectTo: 'login',
      },
];

export default routes;
