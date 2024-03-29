import { Component } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Category } from '../../../model/category.model';
import { take } from 'rxjs';

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
  category?: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.getCategory(id);
  }

  getCategory(id: string): void {
    this.categoryService.get(id).pipe(take(1)).subscribe({
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
