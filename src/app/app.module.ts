import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ReportedAdsComponent } from './views/initial/panel-admin/reported-ads/reported-ads.component';
import { FeaturesComponent } from './views/initial/panel-admin/features/features.component';
import { BreedsComponent } from './views/initial/panel-admin/breeds/breeds.component';
import { AnimalTypesComponent } from './views/initial/panel-admin/animal-types/animal-types.component';
import { SizesComponent } from './views/initial/panel-admin/sizes/sizes.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from 'src/core/core.module';
import { AlertComponent } from '../core/components/alert/alert.component';
import { MeuDashboardComponent } from './views/initial/meu-dashboard/meu-dashboard.component';
import { InitialComponent } from './views/initial/initial.component';
import { BusinessAnalysisComponent } from './views/initial/business-analysis/business-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GeoDataService } from 'src/core/services/geo-data.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  providers: [GeoDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
