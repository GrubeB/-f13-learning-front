import { Component, Input } from '@angular/core';
import { Category } from '../../../model/category.model';
import { CommonModule } from '@angular/common';
import { CategoriesListItemComponent } from '../categories-list-item/categories-list-item.component';

@Component({
  selector: 'categories-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListItemComponent
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent {
  @Input() categories!: Category[];
}
