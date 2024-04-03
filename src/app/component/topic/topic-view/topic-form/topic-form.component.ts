import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Reference } from '../../../../model/reference.model';
import { first, take } from 'rxjs';
import { TopicReferenceService } from '../../../../service/topic-reference.service';
import { EventBusService } from '../../../../service/event-bus.service';
import { TopicService } from '../../../../service/topic.service';
import { Topic } from '../../../../model/topic.model';
import { CreateTopicEvent, EditTopicEvent, TopicCreatedEvent, TopicUpdateddEvent } from '../../topic-module.event';
import { TopicQueryService } from '../../../../service/topic-query.service';

@Component({
  selector: 'topic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './topic-form.component.html',
  styleUrl: './topic-form.component.scss'
})
export class TopicFormComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  topicService = inject(TopicService);
  topicQueryService = inject(TopicQueryService);

  message?: string;

  isEditForm: boolean = false;
  editTopic?: Topic;

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    content: new FormControl('', [
    ]),
  });

  constructor() {
    this.eventBus.listen(CreateTopicEvent.name, (event: CreateTopicEvent) => {
      this.formViable ? this.hideForm() : this.showForm();
    });

    this.eventBus.listen(EditTopicEvent.name, (event: EditTopicEvent) => {
      this.isEditForm = true;
      this.topicQueryService.get(event.topicId).pipe(take(1)).subscribe({
        next: data => {
          this.editTopic = data;
          this.formGroup.setValue({
            name: this.editTopic?.name ?? "",
            content: this.editTopic?.content ?? "",
          });
          this.showForm();
        }
      })
    });
  }

  submit() {
    this.logger.debug(TopicFormComponent.name, "submit");
    if (this.formGroup.valid) {
      this.isEditForm ? this.updateCategory() : this.createCategory();
    }
    if (this.formGroup.valid) {

    }
  }
  createCategory() {
    let topic = new Topic();
    topic.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    topic.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    topic.categories = [];
    this.topicService.create(topic)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(TopicFormComponent.name, " topic created ", response.id);
          this.eventBus.emit(TopicCreatedEvent.name, new TopicCreatedEvent(response.id));
          this.hideForm();
        },
        error: e => {
          this.logger.debug(TopicFormComponent.name, " error occurred while creating topic ", e);
          this.message = e.message;
        }
      })
  }
  updateCategory() {
    let topic = new Topic();
    topic.id = this.editTopic?.id ?? '';
    topic.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    topic.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    topic.categories = [];
    this.topicService.update(topic)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(TopicFormComponent.name, " topic updated ", topic.id);
          this.eventBus.emit(TopicUpdateddEvent.name, new TopicUpdateddEvent(topic.id));
          this.hideForm();
        },
        error: e => {
          this.logger.debug(TopicFormComponent.name, " error occurred while updateing topic ", e);
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
