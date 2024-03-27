import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { FirstComponent } from './component/first/first.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `home`
    { path: 'home', component: HomeComponent },
    { path: 'first-component', component: FirstComponent },
    { path: '**', component: PageNotFoundComponent }, // Wildcard route for a 404 page
];
