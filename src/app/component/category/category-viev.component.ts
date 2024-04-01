import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../model/category.model';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryQueryService } from '../../service/category-query.service';

@Component({
  selector: 'category-viev',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListComponent
  ],
  templateUrl: './category-viev.component.html',
  styleUrl: './category-viev.component.scss'
})
export class CategoryVievComponent implements OnInit {
  categoryQueryService = inject(CategoryQueryService)

  categories: Category[] =[];


  ngOnInit(): void {
    this.categoryQueryService.getAll().pipe(take(1)).subscribe({
      next: data => {
        this.categories = data.content;
      },
      error: e => {
        this.categories = [];
      }
    });
  }
}
