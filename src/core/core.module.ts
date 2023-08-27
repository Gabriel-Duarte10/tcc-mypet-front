
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
import { LoadingComponent } from './components/loading.component';

const components = [
  LoadingComponent,
];
const modules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  // Grafico Material

  // Angular Bootstrap

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
  MatPaginatorModule
];

@NgModule({
  imports: [...modules],
  providers: [httpInterceptorProviders],
  declarations: [...components],
  exports: [...components, ...modules],
})
export class CoreModule { }

