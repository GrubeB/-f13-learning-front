import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategoryVievComponent } from '../category/category-view/category-viev.component';
import { TopicDetailsComponent } from '../topic/topic-details/topic-details.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CategoryVievComponent,
    TopicDetailsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
