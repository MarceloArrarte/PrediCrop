import { Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FinalRecomendationComponent } from './final-recomendation/final-recomendation.component';
import { PriceTrendsComponent } from './price-trends/price-trends.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'newPrediction', component: PrincipalComponent }
];
