import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../model/category.model';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { CategoriesListComponent } from './categories-list/categories-list.component';

@Component({
  selector: 'category-viev',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListComponent
  ],
  templateUrl: './category-viev.component.html',
  styleUrl: './category-viev.component.css'
})
export class CategoryVievComponent implements OnInit {
  categories: Category[] =[];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAll().pipe(take(1)).subscribe({
      next: data => {
        this.categories = data.content;
      },
      error: e => {
        this.categories = [];
      }
    });
  }
}
