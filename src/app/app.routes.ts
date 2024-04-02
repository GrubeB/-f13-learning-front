import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { CategoryVievComponent } from './component/category/category-viev.component';
import { CategoryDetailsViewComponent } from './component/category/category-details-view/category-details-view.component';
import { TopicViewComponent } from './component/topic/topic-view/topic-view.component';
import { TopicDetailsViewComponent } from './component/topic/topic-details-view/topic-details-view.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `home`
    { path: 'home', component: HomeComponent },
    { path: 'categories', component: CategoryVievComponent },
    { path: 'topics', component: TopicViewComponent },
    { path: 'topics/:id', component: TopicDetailsViewComponent },
    { path: 'categories/:id', component: CategoryDetailsViewComponent },
    { path: '**', component: PageNotFoundComponent }, // Wildcard route for a 404 page
];
