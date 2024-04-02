import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { TopicService } from '../../../service/topic.service';
import { first, take } from 'rxjs';
import { TopicsListComponent } from '../topics-list/topics-list.component';
import { TopicDetailsModalComponent } from '../topic-details-modal/topic-details-modal.component';
import { EventBusService } from '../../../service/event-bus.service';
import { DeleteTopicEvent, HideTopicDetailsModalEvent, ShowTopicDetailsModalEvent, TopicCreatedEvent } from '../topic-module.event';
import { TopicQueryService } from '../../../service/topic-query.service';
import { NGXLogger } from 'ngx-logger';
import { TopicFormComponent } from '../topic-form/topic-form.component';


@Component({
  selector: 'topic-view',
  standalone: true,
  imports: [
    CommonModule,
    TopicsListComponent,
    TopicDetailsModalComponent,
    TopicFormComponent
  ],
  templateUrl: './topic-view.component.html',
  styleUrl: './topic-view.component.scss'
})
export class TopicViewComponent implements OnInit {
  topicQueryService = inject(TopicQueryService);
  topicService = inject(TopicService);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);

  topics: Topic[] = [];

  constructor() {
    this.eventBus.listen(TopicCreatedEvent.name, (e: TopicCreatedEvent) => {
      this.getTopics(); 
      this.toggleTopicForm();
    });
    this.eventBus.listen(DeleteTopicEvent.name, (event: DeleteTopicEvent) => {
      this.topicService.delete(event.topicId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(TopicViewComponent.name, "Deleted Topic ", event.topicId);
          this. getTopics();
        },
        error: e => {
          this.logger.debug(TopicViewComponent.name, "Error occured while deleting topic ", e);
        }
      })
    })
  }
  ngOnInit(): void {
    this.getTopics();
  }

  getTopics() {
    this.logger.debug(TopicViewComponent.name, " getTopics()");
    this.topicQueryService.getAll().pipe(take(1)).subscribe({
      next: data => {
        this.topics = data.content;
      },
      error: e => {
        this.topics = [];
      }
    });
  }
  // TOPIC FORM
  topicFormViable: boolean = false;
  toggleTopicForm() {
    this.logger.debug(TopicViewComponent.name, "toggleTopicForm()");
    this.topicFormViable = !this.topicFormViable;
  }
}
