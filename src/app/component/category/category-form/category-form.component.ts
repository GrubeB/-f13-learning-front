import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { first, take } from 'rxjs';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CategoryService } from '../category.service';
import { CategoryCreatedEvent, CategoryUpdatedEvent, UpdateCategoryEvent } from '../category-module.event';
import { Category, CreateCategoryCommand, UpdateCategoryCommand } from '../category.model';
import { CategoryQueryService } from '../category-query.service';
import { MultiSelectComponent } from '../../../shared/component/multi-select/multi-select.component';

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
  editModel?: Category;

  constructor() {
    this.eventBus.listen(CreateCategoryCommand.name, (event: CreateCategoryCommand) => {
      this.fillForm();
    });

    this.eventBus.listen(UpdateCategoryEvent.name, (event: UpdateCategoryEvent) => {
      this.categoryQueryService.get(event.categoryId).pipe(take(1)).subscribe({
        next: data => this.fillForm(data)
      });
    });
  }

  ngOnInit(): void {
    this.categoryQueryService.getAll().pipe(take(1)).subscribe({
      next: data => {
        this.categories = data.content;
      }
    })
  }
  fillForm(model?: Category) {
    this.logger.debug(CategoryFormComponent.name, " fillForm()", model)
    this.formGroup.reset();
    this.message = '';
    if (!model) {
      this.isEditForm = false;
      this.editModel = undefined;
      this.formGroup.setValue({
        name: "",
        description: "",
        parentCategories: [],
        childCategories: [],
      });
    } else {
      this.isEditForm = true;
      this.editModel = model;
      this.formGroup.setValue({
        name: this.editModel.name,
        description: this.editModel.description,
        parentCategories: this.editModel.parents,
        childCategories: this.editModel.children,
      });
    }
  }


  submit() {
    this.logger.debug(CategoryFormComponent.name, "submit");
    if (this.formGroup.valid) {
      this.isEditForm ? this.update() : this.create();
    }
  }

  private update() {
    let command = new UpdateCategoryCommand();
    command.id = this.editModel?.id ?? (() => { throw new Error("Edit model ID is null or undefined."); })();
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
          this.fillForm();
        },
        error: e => {
          this.logger.debug(CategoryFormComponent.name, " error occurred while updating category ", e);
          this.message = e.message;
        }
      });
  }

  private create() {
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
          this.fillForm();
        },
        error: e => {
          this.logger.debug(CategoryFormComponent.name, " error occurred while creating category ", e);
          this.message = e.message;
        }
      });
  }
}
