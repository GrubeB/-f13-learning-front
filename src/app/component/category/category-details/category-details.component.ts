import { Component, Input, inject } from '@angular/core';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Category } from '../category.model';
import { take } from 'rxjs';
import { CategoryQueryService } from '../category-query.service';
import { CategoriesListComponent } from '../category-view/category-list/category-list.component';

@Component({
  selector: 'category-details',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListComponent,
  ],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent {
  route = inject(ActivatedRoute);
  categoryQueryService = inject(CategoryQueryService);
  location = inject(Location);

  @Input() categoryId!: string;
  category?: Category;

  ngOnInit(): void {
    this.getCategory(this.categoryId);
  }

  getCategory(id: string): void {
    this.categoryQueryService.get(id).pipe(take(1)).subscribe({
      next: data => {
        this.category = data;
      },
      error: e => {
      }
    });
  }
}
