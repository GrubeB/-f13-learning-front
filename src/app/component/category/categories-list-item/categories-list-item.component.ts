import { Component, Input } from '@angular/core';
import { Category } from '../../../model/category.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'categories-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './categories-list-item.component.html',
  styleUrl: './categories-list-item.component.scss'
})
export class CategoriesListItemComponent {
  @Input() category!: Category;
}
