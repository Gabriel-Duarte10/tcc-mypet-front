import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "src/app/auth/forgot-password/forgot-password.component";
import { LoginComponent } from "src/app/auth/login/login.component";
import { RegisterComponent } from "src/app/auth/register/register.component";
import { AnimalsDashboardComponent } from "src/app/views/dashboards/animals-dashboard/animals-dashboard.component";
import { UsersDashboardComponent } from "src/app/views/dashboards/users-dashboard/users-dashboard.component";
import { ReportedAdsComponent } from "src/app/views/reported-ads/reported-ads.component";
import { FeaturesComponent } from "src/app/views/features/features.component";
import { BreedsComponent } from "src/app/views/breeds/breeds.component";
import { AnimalTypesComponent } from "src/app/views/animal-types/animal-types.component";
import { SizesComponent } from "src/app/views/sizes/sizes.component";

const routes: Routes = [
    {path: 'animals', component: AnimalsDashboardComponent},
    {path: 'users', component: UsersDashboardComponent},
    {path: 'reported-ads', component: ReportedAdsComponent},
    {path: 'features', component: FeaturesComponent},
    {path: 'breeds', component: BreedsComponent},
    {path: 'animal-types', component: AnimalTypesComponent},
    {path: 'sizes', component: SizesComponent},
    {
        path: '**',
        redirectTo: 'animals',
    },
];

export default routes;
