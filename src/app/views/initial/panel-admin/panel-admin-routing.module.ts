import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from "src/app/auth/register/register.component";
import { ReportedAdsComponent } from "src/app/views/initial/panel-admin/reported-ads/reported-ads.component";
import { FeaturesComponent } from "src/app/views/initial/panel-admin/features/features.component";
import { BreedsComponent } from "src/app/views/initial/panel-admin/breeds/breeds.component";
import { AnimalTypesComponent } from "src/app/views/initial/panel-admin/animal-types/animal-types.component";
import { SizesComponent } from "src/app/views/initial/panel-admin/sizes/sizes.component";
import { PanelAdminComponent } from './panel-admin.component';
import { MeuDashboardComponent } from '../meu-dashboard/meu-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PanelAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'reported-ads',
        pathMatch: 'full'
      },
      {
        path: 'reported-ads',
        component: ReportedAdsComponent,
        data: { breadcrumb: 'Anúncios Denunciados' }
      },
      {
        path: 'features',
        component: FeaturesComponent,
        data: { breadcrumb: 'Características' }
      },
      {
        path: 'breeds',
        component: BreedsComponent,
        data: { breadcrumb: 'Raças' }
      },
      {
        path: 'animal-types',
        component: AnimalTypesComponent,
        data: { breadcrumb: 'Tipos de Animais' }
      },
      {
        path: 'sizes',
        component: SizesComponent,
        data: { breadcrumb: 'Portes' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelAdminRoutingModule { }
