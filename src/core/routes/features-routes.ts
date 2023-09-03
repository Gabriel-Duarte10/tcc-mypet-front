import { Routes } from "@angular/router";
import { InitialComponent } from "src/app/views/initial/initial.component";

const routes: Routes = [
    {
      path: 'initial',
      loadChildren: () => import('src/app/views/initial/initial.module').then(m => m.InitialModule),
      data: { breadcrumb: 'Início' },
    },
    {
        path: '**',
        redirectTo: 'initial',
    },
];

export default routes;
