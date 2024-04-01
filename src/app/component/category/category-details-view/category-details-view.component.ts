import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Category } from '../../../model/category.model';
import { take } from 'rxjs';
import { CategoryQueryService } from '../../../service/category-query.service';

@Component({
  selector: 'category-details-view',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './category-details-view.component.html',
  styleUrl: './category-details-view.component.scss'
})
export class CategoryDetailsViewComponent {
  route = inject(ActivatedRoute);
  categoryQueryService = inject(CategoryQueryService);
  location = inject(Location);

  category?: Category;

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.getCategory(id);
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
  goBack(): void {
    this.location.back();
  }
}
