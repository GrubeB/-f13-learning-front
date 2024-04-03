import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { Category } from '../../../model/category.model';
import { CommonModule } from '@angular/common';
import { first, take } from 'rxjs';
import { CategoriesListComponent } from './category-list/category-list.component';
import { CategoryQueryService } from '../../../service/category-query.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../service/event-bus.service';
import { CategoryCreatedEvent, DeleteCategoryEvent } from '../category-module.event';
import { CategoryFormComponent } from './category-form/category-form.component';

@Component({
  selector: 'category-viev',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListComponent,
    CategoryFormComponent
  ],
  templateUrl: './category-viev.component.html',
  styleUrl: './category-viev.component.scss'
})
export class CategoryVievComponent implements OnInit {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  categoryQueryService = inject(CategoryQueryService)
  categoryService = inject(CategoryService)

  categories: Category[] = [];

  constructor() {
    this.eventBus.listen(CategoryCreatedEvent.name, (e: CategoryCreatedEvent) => {
      this.getCategories();
      this.toggleCategoryForm();
    });

    this.eventBus.listen(DeleteCategoryEvent.name, (event: DeleteCategoryEvent) => {
      this.categoryService.delete(event.categoryId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(CategoryVievComponent.name, "Deleted Category ", event.categoryId);
          this.getCategories();
        },
        error: e => {
          this.logger.debug(CategoryVievComponent.name, "Error occured while deleting category ", e);
        }
      })
    })
  }

  ngOnInit(): void {
    this.getCategories();
  }
  getCategories() {
    this.logger.debug(CategoryVievComponent.name, " getCategories()");
    this.categoryQueryService.getAll().pipe(take(1)).subscribe({
      next: data => {
        this.categories = data.content;
      },
      error: e => {
        this.categories = [];
      }
    });
  }

  // CATEGORY FORM
  categoryFormViable: boolean = true;
  toggleCategoryForm() {
    this.logger.debug(CategoryVievComponent.name, "toggleCategoryForm()");
    this.categoryFormViable = !this.categoryFormViable;
  }
}
