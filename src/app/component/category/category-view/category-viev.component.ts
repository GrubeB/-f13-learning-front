import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category, CreateCategoryCommand, UpdateCategoryCommand } from '../category.model';
import { CommonModule } from '@angular/common';
import { first, take } from 'rxjs';
import { CategoriesListComponent } from '../category-list/category-list.component';
import { CategoryQueryService } from '../category-query.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CategoryCreatedEvent, CategoryDeletedEvent, CategoryUpdatedEvent, CreateCategoryEvent, DeleteCategoryEvent, UpdateCategoryEvent } from '../category-module.event';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { BreadcrumbItem } from '../../../shared/component/breadcrumb/breadcrumb.component';

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
    ], (e: any) => {
      this.getCategories();
      this.changeTab(Tabs.LIST);
    });

    this.eventBus.listen([
      UpdateCategoryEvent.name,
      CreateCategoryEvent.name
    ], (event: any) => {
      this.changeTab(Tabs.FORM);
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

  // TABS
  tabs = [Tabs.LIST, Tabs.FORM];
  activeTab = this.tabs[0];
  changeTab(tabName: string) {
    this.logger.debug(CategoryVievComponent.name, "changeTab()");
    var tab: Tabs = Tabs[tabName as keyof typeof Tabs];
    if (tab && this.tabs.includes(tab)) {
      let index = this.tabs.indexOf(tab);
      this.activeTab = this.tabs[index];
    }
  };
}
enum Tabs {
  LIST = "LIST",
  FORM = "FORM",
}