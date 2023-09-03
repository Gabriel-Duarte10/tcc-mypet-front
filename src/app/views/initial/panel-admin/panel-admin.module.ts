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


@NgModule({
  declarations: [
    PanelAdminComponent,
    ReportedAdsComponent,
    FeaturesComponent,
    BreedsComponent,
    AnimalTypesComponent,
    SizesComponent,
  ],
  imports: [
    CommonModule,
    PanelAdminRoutingModule,
    CoreModule
  ]
})
export class PanelAdminModule { }
