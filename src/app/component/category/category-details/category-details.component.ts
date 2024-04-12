import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Category } from '../category.model';
import { take } from 'rxjs';
import { CategoryQueryService } from '../category-query.service';
import { CategoriesListComponent } from '../category-list/category-list.component';
import { CategorySectionComponent } from '../category-section/category-section.component';

@Component({
  selector: 'category-details',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListComponent,
    CategorySectionComponent,
  ],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent {
  route = inject(ActivatedRoute);
  queryService = inject(CategoryQueryService);
  location = inject(Location);

  @Input() modelId!: string;
  model?: Category;

  ngOnInit(): void {
    this.getModel(this.modelId);
  }

  getModel(id: string): void {
    this.queryService.get(id).pipe(take(1)).subscribe({
      next: data => {
        this.model = data;
      },
      error: e => {
      }
    });
  }
}
