import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from 'src/core/components/loading/loading.component';

const entryRoute: Routes = [{ path: '**', component: LoadingComponent}]

@NgModule({
  imports: [RouterModule.forRoot(entryRoute)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
