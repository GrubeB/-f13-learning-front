import { Component, Input } from '@angular/core';
import { Category } from '../../category.model';
import { CommonModule } from '@angular/common';
import { CategoriesListItemComponent } from '../category-list-item/category-list-item.component';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListItemComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoriesListComponent {
  @Input() categories!: Category[];
}
