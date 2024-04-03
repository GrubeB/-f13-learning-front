import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { first, take } from 'rxjs';
import { EventBusService } from '../../../../service/event-bus.service';
import { CategoryService } from '../../../../service/category.service';
import { CategoryCreatedEvent, CategoryUpdatedEvent, EditCategoryEvent } from '../../category-module.event';
import { Category, CreateCategoryCommand, UpdateCategoryCommand } from '../../../../model/category.model';
import { CategoryQueryService } from '../../../../service/category-query.service';
import { MultiSelectComponent } from '../../../../../shared/multi-select/multi-select.component';

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectComponent,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  categoryService = inject(CategoryService);
  categoryQueryService = inject(CategoryQueryService);

  categories: Category[] = [];
  message?: string;
  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl('', [
    ]),
    parentCategories: new FormControl<Category[]>([]),
    childCategories: new FormControl<Category[]>([]),
  });

  isEditForm: boolean = false;
  editCategory?: Category;

  constructor() {
    this.eventBus.listen(CreateCategoryCommand.name, (event: CreateCategoryCommand) => {
      this.formViable ? this.hideForm() : this.showForm();
    });

    this.eventBus.listen(EditCategoryEvent.name, (event: EditCategoryEvent) => {
      this.isEditForm = true;
      this.categoryQueryService.get(event.categoryId).pipe(take(1)).subscribe({
        next: data => {
          this.editCategory = data;
          this.formGroup.setValue({
            name: this.editCategory?.name ?? "",
            description: this.editCategory?.description ?? "",
            parentCategories: this.editCategory?.parents ?? [],
            childCategories: this.editCategory?.children ?? [],
          });
          this.showForm();
        }
      })
    });
  }

  ngOnInit(): void {
    this.categoryQueryService.getAll().pipe(take(1)).subscribe({
      next: data => {
        this.categories = data.content;
      }
    })
  }

  submit() {
    this.logger.debug(CategoryFormComponent.name, "submit");
    if (this.formGroup.valid) {
      this.isEditForm ? this.updateCategory() : this.createCategory();
    }
  }

  private updateCategory() {
    let command = new UpdateCategoryCommand();
    command.id = this.editCategory?.id ?? '';
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.description = this.formGroup.value.description ? this.formGroup.value.description as string : '';
    command.parents = this.formGroup.value.parentCategories?.map(cat => cat['id']) as string[] ?? [];
    command.children = this.formGroup.value.childCategories?.map(cat => cat['id']) as string[] ?? [];

    this.categoryService.update(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(CategoryFormComponent.name, " updated created ", command.id);
          this.eventBus.emit(CategoryUpdatedEvent.name, new CategoryUpdatedEvent(command.id));
          this.hideForm();
        },
        error: e => {
          this.logger.debug(CategoryFormComponent.name, " error occurred while updating category ", e);
          this.message = e.message;
        }
      })
  }

  private createCategory() {
    let command = new CreateCategoryCommand();
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.description = this.formGroup.value.description ? this.formGroup.value.description as string : '';
    command.parents = this.formGroup.value.parentCategories?.map(cat => cat['id']) as string[] ?? [];
    command.children = this.formGroup.value.childCategories?.map(cat => cat['id']) as string[] ?? [];

    this.categoryService.create(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(CategoryFormComponent.name, " category created ", response.id);
          this.eventBus.emit(CategoryCreatedEvent.name, new CategoryCreatedEvent(response.id));
          this.hideForm();
        },
        error: e => {
          this.logger.debug(CategoryFormComponent.name, " error occurred while creating category ", e);
          this.message = e.message;
        }
      })
  }

  formViable: boolean = false;
  showForm() {
    this.formViable = true
  }
  hideForm() {
    this.formViable = false;
  }
}
