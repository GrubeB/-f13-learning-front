import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { CategoryVievComponent } from './component/category/category-view/category-viev.component';
import { CategoryDetailsViewComponent } from './component/category/category-details-view/category-details-view.component';
import { TopicViewComponent } from './component/topic/topic-view/topic-view.component';
import { TopicDetailsViewComponent } from './component/topic/topic-details-view/topic-details-view.component';
import { GroupViewComponent } from './component/group/group-view/group-view.component';
import { GroupDetailsViewComponent } from './component/group/group-details-view/group-details-view.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `home`
    { path: 'home', component: HomeComponent },
    { path: 'categories', component: CategoryVievComponent },
    { path: 'categories/:id', component: CategoryDetailsViewComponent },
    { path: 'topics', component: TopicViewComponent },
    { path: 'topics/:id', component: TopicDetailsViewComponent },
    { path: 'groups', component: GroupViewComponent },
    { path: 'groups/:id', component: GroupDetailsViewComponent },
    { path: '**', component: PageNotFoundComponent }, // Wildcard route for a 404 page
];
