import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Reference } from '../../reference/reference.model';
import { first, take } from 'rxjs';
import { TopicReferenceService } from '../../reference/topic-reference.service';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { TopicService } from '../topic.service';
import { CreateTopicCommand, Topic, UpdateTopicCommand } from '../topic.model';
import { CreateTopicEvent, UpdateTopicEvent, TopicCreatedEvent, TopicUpdateddEvent } from '../topic-module.event';
import { TopicQueryService } from '../topic-query.service';
import { Category } from '../../category/category.model';
import { CategoryQueryService } from '../../category/category-query.service';
import { MultiSelectComponent } from '../../../shared/component/multi-select/multi-select.component';

@Component({
  selector: 'topic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectComponent
  ],
  templateUrl: './topic-form.component.html',
  styleUrl: './topic-form.component.scss'
})
export class TopicFormComponent implements OnInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  topicService = inject(TopicService);
  topicQueryService = inject(TopicQueryService);
  categoryQueryService = inject(CategoryQueryService);

  message?: string;

  isEditForm: boolean = false;
  editModel?: Topic;

  allCategories: Category[] = [];

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    content: new FormControl('', [
    ]),
    categories: new FormControl<Category[]>([]),
  });

  constructor() {
    this.eventBus.listen(CreateTopicEvent.name, (event: CreateTopicEvent) => {
      this.fillForm();
    });

    this.eventBus.listen(UpdateTopicEvent.name, (event: UpdateTopicEvent) => {
      this.isEditForm = true;
      this.topicQueryService.get(event.topicId).pipe(take(1)).subscribe({
        next: data => this.fillForm(data)
      })
    });
  }
  
  ngOnInit(): void {
    this.categoryQueryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.allCategories = data.content;
      }
    })
  }

  fillForm(model?: Topic) {
    this.logger.debug(TopicFormComponent.name, " fillForm()", model)
    this.formGroup.reset();
    this.message = '';
    if (!model) {
      this.isEditForm = false;
      this.editModel = undefined;
      this.formGroup.setValue({
        name: "",
        content: "",
        categories: []
      });
    } else {
      this.isEditForm = true;
      this.editModel = model;
      this.formGroup.setValue({
        name: this.editModel.name,
        content: this.editModel.content,
        categories: this.editModel.categories,
      });
    }
  }

  submit() {
    this.logger.debug(TopicFormComponent.name, "submit");
    if (this.formGroup.valid) {
      this.isEditForm ? this.updateCategory() : this.createCategory();
    }
  }
  createCategory() {
    let command = new CreateTopicCommand();
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    command.categoryIds = this.formGroup.value.categories?.map(cat => cat['id']) as string[] ?? [];

    this.topicService.create(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(TopicFormComponent.name, " topic created ", response.id);
          this.eventBus.emit(TopicCreatedEvent.name, new TopicCreatedEvent(response.id));
          this.fillForm();
        },
        error: e => {
          this.logger.debug(TopicFormComponent.name, " error occurred while creating topic ", e);
          this.message = e.message;
        }
      });
  }
  updateCategory() {
    let command = new UpdateTopicCommand();
    command.id = this.editModel?.id ?? (() => { throw new Error("Edit model ID is null or undefined."); })();
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    command.categoryIds = this.formGroup.value.categories?.map(cat => cat['id']) as string[] ?? [];

    this.topicService.update(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(TopicFormComponent.name, " topic updated ", command.id);
          this.eventBus.emit(TopicUpdateddEvent.name, new TopicUpdateddEvent(command.id));
          this.fillForm();
        },
        error: e => {
          this.logger.debug(TopicFormComponent.name, " error occurred while updateing topic ", e);
          this.message = e.message;
        }
      });
  }
}
