import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { first, take } from 'rxjs';
import { EventBusService } from '../../../../service/event-bus.service';
import { CategoryService } from '../../../../service/category.service';
import { CategoryCreatedEvent } from '../../category-module.event';
import { Category, CreateCategoryCommand } from '../../../../model/category.model';
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
export class CategoryFormComponent implements OnInit{
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
    parentCategories: new FormControl([]),
    childCategories: new FormControl([]),
  });
  
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
      let newCategoryCommand = new CreateCategoryCommand();
      newCategoryCommand.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
      newCategoryCommand.description = this.formGroup.value.description ? this.formGroup.value.description as string : '';
      newCategoryCommand.parents = this.formGroup.value.parentCategories?.map(cat => cat['id']) as string[] ?? [];
      newCategoryCommand.children = this.formGroup.value.childCategories?.map(cat => cat['id']) as string[] ?? [];
      this.categoryService.create(newCategoryCommand)
        .pipe(first())
        .subscribe({
          next: response => {
            this.logger.debug(CategoryFormComponent.name, " category created ", response.id);
            this.eventBus.emit(CategoryCreatedEvent.name, new CategoryCreatedEvent(response.id));
          },
          error: e => {
            this.logger.debug(CategoryFormComponent.name, " error occurred while creating category ", e);
            this.message = e.message;
          }
        })
    }
  }

}
