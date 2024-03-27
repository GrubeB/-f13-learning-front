import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategoryVievComponent } from '../category/category-viev/category-viev.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CategoryVievComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
