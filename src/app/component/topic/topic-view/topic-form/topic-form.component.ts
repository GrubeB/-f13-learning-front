import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Reference } from '../../../../model/reference.model';
import { first } from 'rxjs';
import { TopicReferenceService } from '../../../../service/topic-reference.service';
import { EventBusService } from '../../../../service/event-bus.service';
import { TopicService } from '../../../../service/topic.service';
import { Topic } from '../../../../model/topic.model';
import { TopicCreatedEvent } from '../../topic-module.event';

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
  logger= inject(NGXLogger);
  eventBus= inject(EventBusService);
  topicService = inject(TopicService);

  message?: string;

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    content: new FormControl('', [
    ]),
  });

  submit() {
    this.logger.debug(TopicFormComponent.name, "submit");
    if (this.formGroup.valid) {
      let newTopic = this.createTopicFromFormValues(this.formGroup.value);

      this.topicService.create(newTopic)
        .pipe(first())
        .subscribe({
          next: response => {
            this.logger.debug(TopicFormComponent.name, " topic created ", response.id);
            this.eventBus.emit(TopicCreatedEvent.name, new TopicCreatedEvent(response.id));
          },
          error: e => {
            this.logger.debug(TopicFormComponent.name, " error occurred while creating topic ", e);
            this.message = e.message;
          }
        })
    }
  }

  private createTopicFromFormValues(formValues: any): Topic {
    let topic = new Topic();
    topic.name = formValues.name ? formValues.name as string : '';
    topic.content = formValues.content ? formValues.content as string : '';
    topic.categories = [];
    return topic;
  }
}
