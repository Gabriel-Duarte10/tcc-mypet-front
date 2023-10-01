
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { httpInterceptorProviders } from './interceptors';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule} from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './components/alert/alert.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HeaderComponent } from './components/header/header.component';
import { UserMenuComponent } from './components/header/user-menu/user-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScreenTableComponent } from './components/screen-table/screen-table.component';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { NgChartsModule } from 'ng2-charts';


const components = [
  LoadingComponent,
  AlertComponent,
  LoadingComponent,
  HeaderComponent,
  UserMenuComponent,
  SidebarComponent,
  NavbarComponent,
  ScreenTableComponent
];
const modules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  // Grafico Material
  NgChartsModule,
  // Angular Bootstrap
  NgbModule,

  //Angular Material
  MatTableModule,
  MatAutocompleteModule,
  MatListModule,
  ScrollingModule,
  MatFormFieldModule,
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatGridListModule,
  CdkAccordionModule,
  DragDropModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatMenuModule,
  MatSortModule
];

@NgModule({
  imports: [...modules],
  providers: [httpInterceptorProviders],
  declarations: [...components, ],
  exports: [...components, ...modules],
})
export class CoreModule { }

