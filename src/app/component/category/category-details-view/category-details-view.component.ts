import { Component, inject } from '@angular/core';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Category } from '../category.model';
import { take } from 'rxjs';
import { CategoryQueryService } from '../category-query.service';
import { CategoryDetailsComponent } from '../category-details/category-details.component';

@Component({
  selector: 'category-details-view',
  standalone: true,
  imports: [
    CommonModule,
    CategoryDetailsComponent
  ],
  templateUrl: './category-details-view.component.html',
  styleUrl: './category-details-view.component.scss'
})
export class CategoryDetailsViewComponent {
  route = inject(ActivatedRoute);
  location = inject(Location);
  
  categoryId?: string;

  ngOnInit(): void {
    this.categoryId = String(this.route.snapshot.paramMap.get('id'));
  }

  goBack(): void {
    this.location.back();
  }
}
