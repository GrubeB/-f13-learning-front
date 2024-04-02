import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { first } from 'rxjs';
import { EventBusService } from '../../../../service/event-bus.service';
import { CategoryService } from '../../../../service/category.service';
import { CategoryCreatedEvent } from '../../category-module.event';
import { Category } from '../../../../model/category.model';

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  categoryService = inject(CategoryService);

  message?: string;

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl('', [
    ]),
  });

  submit() {
    this.logger.debug(CategoryFormComponent.name, "submit");
    if (this.formGroup.valid) {
      let newCategory = new Category();
      newCategory.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
      newCategory.description = this.formGroup.value.description ? this.formGroup.value.description as string : '';

      this.categoryService.create(newCategory)
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
