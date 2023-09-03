import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitialRoutingModule } from './initial-routing.module';
import { PanelAdminComponent } from './panel-admin/panel-admin.component';
import { InitialComponent } from './initial.component';
import { CoreModule } from 'src/core/core.module';
import { MeuDashboardComponent } from './meu-dashboard/meu-dashboard.component';


@NgModule({
  declarations: [
    InitialComponent,
    MeuDashboardComponent
  ],
  imports: [
    CommonModule,
    InitialRoutingModule,
    CoreModule
  ]
})
export class InitialModule { }
