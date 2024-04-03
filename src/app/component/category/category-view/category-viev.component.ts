import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { Category, CreateCategoryCommand } from '../../../model/category.model';
import { CommonModule } from '@angular/common';
import { first, take } from 'rxjs';
import { CategoriesListComponent } from './category-list/category-list.component';
import { CategoryQueryService } from '../../../service/category-query.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../service/event-bus.service';
import { CategoryCreatedEvent, CategoryDeletedEvent, CategoryUpdatedEvent, DeleteCategoryEvent, EditCategoryEvent } from '../category-module.event';
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
    this.eventBus.listen([
      CategoryCreatedEvent.name,
      CategoryUpdatedEvent.name,
      CategoryDeletedEvent.name
    ], (e: CategoryCreatedEvent) => {
      this.getCategories();
    });

    this.eventBus.listen(DeleteCategoryEvent.name, (event: DeleteCategoryEvent) => {
      this.categoryService.delete(event.categoryId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(CategoryVievComponent.name, "Deleted Category ", event.categoryId);
          this.eventBus.emit(CategoryDeletedEvent.name, new CategoryDeletedEvent(event.categoryId));
        },
        error: e => {
          this.logger.debug(CategoryVievComponent.name, "Error occured while deleting category ", e);
        }
      })
    });
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

  showCategoryForm() {
    this.logger.debug(CategoryVievComponent.name, "showCategoryForm()");
    this.eventBus.emit(CreateCategoryCommand.name, new CreateCategoryCommand());
  }
}
