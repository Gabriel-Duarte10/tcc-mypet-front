import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportedAdsComponent } from "src/app/views/initial/panel-admin/reported-ads/reported-ads.component";
import { FeaturesComponent } from "src/app/views/initial/panel-admin/features/features.component";
import { BreedsComponent } from "src/app/views/initial/panel-admin/breeds/breeds.component";
import { AnimalTypesComponent } from "src/app/views/initial/panel-admin/animal-types/animal-types.component";
import { SizesComponent } from "src/app/views/initial/panel-admin/sizes/sizes.component";
import { PanelAdminComponent } from './panel-admin.component';
import { FeaturesAddComponent } from './features/features-add/features-add.component';
import { FeaturesEditComponent } from './features/features-edit/features-edit.component';
import { BreedsAddComponent } from './breeds/breeds-add/breeds-add.component';
import { BreedsEditComponent } from './breeds/breeds-edit/breeds-edit.component';
import { AnimalTypesAddComponent } from './animal-types/animal-types-add/animal-types-add.component';
import { AnimalTypesEditComponent } from './animal-types/animal-types-edit/animal-types-edit.component';
import { SizesAddComponent } from './sizes/sizes-add/sizes-add.component';
import { SizesEditComponent } from './sizes/sizes-edit/sizes-edit.component';
import { CharacteristicsResolver } from './features/characteristics.resolver';
import { SizesResolver } from './sizes/sizes.resolver';
import { AnimalTypesResolver } from './animal-types/animal-types.resolver';
import { BreedsResolver } from './breeds/breeds.resolver';

const routes: Routes = [
  {
    path: '',
    component: PanelAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'features',
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
        path: 'features/add',
        component: FeaturesAddComponent,
        data: { breadcrumb: 'Adicionar Características' }
      },
      {
        path: 'features/edit/:id',
        component: FeaturesEditComponent,
        resolve: { feature: CharacteristicsResolver },
        data: { breadcrumb: 'Editar Características' }
      },
      {
        path: 'breeds',
        component: BreedsComponent,
        data: { breadcrumb: 'Raças' }
      },
      {
        path: 'breeds/add',
        component: BreedsAddComponent,
        resolve: { feature: BreedsResolver },
        data: { breadcrumb: 'Adicionar Raça' }
      },
      {
        path: 'breeds/edit/:id',
        component: BreedsEditComponent,
        resolve: { feature: BreedsResolver },
        data: { breadcrumb: 'Editar Raça' }
      },
      {
        path: 'animal-types',
        component: AnimalTypesComponent,
        data: { breadcrumb: 'Tipos de Animais' }
      },
      {
        path: 'animal-types/add',
        component: AnimalTypesAddComponent,
        data: { breadcrumb: 'Adicionar Tipo de Animal' }
      },
      {
        path: 'animal-types/edit/:id',
        component: AnimalTypesEditComponent,
        resolve: { feature: AnimalTypesResolver },
        data: { breadcrumb: 'Editar Tipo de Animal' }
      },
      {
        path: 'sizes',
        component: SizesComponent,
        data: { breadcrumb: 'Portes' }
      },
      {
        path: 'sizes/add',
        component: SizesAddComponent,
        data: { breadcrumb: 'Adicionar Porte' }
      },
      {
        path: 'sizes/edit/:id',
        component: SizesEditComponent,
        resolve: { size: SizesResolver },
        data: { breadcrumb: 'Editar Porte' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelAdminRoutingModule { }
