import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AnimalsDashboardComponent } from './views/dashboards/animals-dashboard/animals-dashboard.component';
import { UsersDashboardComponent } from './views/dashboards/users-dashboard/users-dashboard.component';
import { ReportedAdsComponent } from './views/reported-ads/reported-ads.component';
import { FeaturesComponent } from './views/features/features.component';
import { BreedsComponent } from './views/breeds/breeds.component';
import { AnimalTypesComponent } from './views/animal-types/animal-types.component';
import { SizesComponent } from './views/sizes/sizes.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from 'src/core/core.module';
import { AlertComponent } from '../core/components/alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AnimalsDashboardComponent,
    UsersDashboardComponent,
    ReportedAdsComponent,
    FeaturesComponent,
    BreedsComponent,
    AnimalTypesComponent,
    SizesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
