import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessAnalysisComponent } from './business-analysis.component';
import { AnimalsDashboardComponent } from './animals-dashboard/animals-dashboard.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import { AnimalDashboardResolver } from './animals-dashboard/animals-dashboard.resolver';

const routes: Routes = [
  {
    path: '',
    component: BusinessAnalysisComponent,
    children: [
      {
        path: '',
        redirectTo: 'animals-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'animals-dashboard',
        component: AnimalsDashboardComponent,
        resolve: { dashboardData: AnimalDashboardResolver },
        data: { breadcrumb: 'Dashboard Animais' }
      },
      {
        path: 'user-dashboard',
        component: UsersDashboardComponent,
        data: { breadcrumb: 'Dashboard Usuários' }
      },
    ]
    }
  ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessAnalysisRoutingModule { }
