import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from "src/app/auth/register/register.component";
import { ReportedAdsComponent } from "src/app/views/initial/panel-admin/reported-ads/reported-ads.component";
import { FeaturesComponent } from "src/app/views/initial/panel-admin/features/features.component";
import { BreedsComponent } from "src/app/views/initial/panel-admin/breeds/breeds.component";
import { AnimalTypesComponent } from "src/app/views/initial/panel-admin/animal-types/animal-types.component";
import { SizesComponent } from "src/app/views/initial/panel-admin/sizes/sizes.component";
import { InitialComponent } from './initial.component';
import { MeuDashboardComponent } from './meu-dashboard/meu-dashboard.component';
import { PanelAdminComponent } from './panel-admin/panel-admin.component';

const routes: Routes = [
  {
    path: '',
    component: InitialComponent,
    children: [
      {
        path: '',
        redirectTo: 'meu-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'meu-dashboard',
        component: MeuDashboardComponent,
        data: { breadcrumb: 'Meu Dashboard' }
      },
      {
        path: 'panel-admin',
        loadChildren: () => import('./panel-admin/panel-admin.module').then(m => m.PanelAdminModule),
        data: { breadcrumb: 'Painel Administrativo' },
      },
      {
        path: 'analise-empresarial',
        loadChildren: () => import('./business-analysis/business-analysis.module').then(m => m.BusinessAnalysisModule),
        data: { breadcrumb: 'Análise Empresarial' },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitialRoutingModule { }
