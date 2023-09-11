import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelAdminRoutingModule } from './panel-admin-routing.module';
import { ReportedAdsComponent } from './reported-ads/reported-ads.component';
import { FeaturesComponent } from './features/features.component';
import { BreedsComponent } from './breeds/breeds.component';
import { AnimalTypesComponent } from './animal-types/animal-types.component';
import { SizesComponent } from './sizes/sizes.component';
import { MeuDashboardComponent } from '../meu-dashboard/meu-dashboard.component';
import { CoreModule } from 'src/core/core.module';
import { PanelAdminComponent } from './panel-admin.component';
import { AnimalTypesAddComponent } from './animal-types/animal-types-add/animal-types-add.component';
import { AnimalTypesEditComponent } from './animal-types/animal-types-edit/animal-types-edit.component';
import { BreedsAddComponent } from './breeds/breeds-add/breeds-add.component';
import { BreedsEditComponent } from './breeds/breeds-edit/breeds-edit.component';
import { FeaturesAddComponent } from './features/features-add/features-add.component';
import { FeaturesEditComponent } from './features/features-edit/features-edit.component';
import { SizesAddComponent } from './sizes/sizes-add/sizes-add.component';
import { SizesEditComponent } from './sizes/sizes-edit/sizes-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PanelAdminComponent,
    ReportedAdsComponent,
    FeaturesComponent,
    BreedsComponent,
    AnimalTypesComponent,
    SizesComponent,
    AnimalTypesAddComponent,
    AnimalTypesEditComponent,
    BreedsAddComponent,
    BreedsEditComponent,
    FeaturesAddComponent,
    FeaturesEditComponent,
    SizesAddComponent,
    SizesEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelAdminRoutingModule,
    CoreModule
  ]
})
export class PanelAdminModule { }
