import { Component, Input } from '@angular/core';
import { Category } from '../../../../model/category.model';
import { CommonModule } from '@angular/common';
import { CategoriesListItemComponent } from '../category-list-item/category-list-item.component';
import { CategoryListItemContextMenuComponent } from '../category-list-item/category-list-item-context-menu/category-list-item-context-menu.component';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListItemComponent,
    CategoryListItemContextMenuComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoriesListComponent {
  @Input() categories!: Category[];
}
