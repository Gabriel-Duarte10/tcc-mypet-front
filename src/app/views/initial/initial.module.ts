import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitialRoutingModule } from './initial-routing.module';
import { PanelAdminComponent } from './panel-admin/panel-admin.component';
import { InitialComponent } from './initial.component';
import { CoreModule } from 'src/core/core.module';
import { MeuDashboardComponent } from './meu-dashboard/meu-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InitialComponent,
    MeuDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InitialRoutingModule,
    CoreModule
  ]
})
export class InitialModule { }
