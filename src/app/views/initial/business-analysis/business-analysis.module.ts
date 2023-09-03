import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessAnalysisRoutingModule } from './business-analysis-routing.module';
import { AnimalsDashboardComponent } from './animals-dashboard/animals-dashboard.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import { CoreModule } from 'src/core/core.module';
import { BusinessAnalysisComponent } from './business-analysis.component';


@NgModule({
  declarations: [
    BusinessAnalysisComponent,
    AnimalsDashboardComponent,
    UsersDashboardComponent,
  ],
  imports: [
    CommonModule,
    BusinessAnalysisRoutingModule,
    CoreModule
  ]
})
export class BusinessAnalysisModule { }
