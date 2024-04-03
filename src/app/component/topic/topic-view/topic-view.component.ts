import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { TopicService } from '../../../service/topic.service';
import { first, take } from 'rxjs';
import { TopicListComponent } from './topics-list/topic-list.component';
import { TopicDetailsModalComponent } from '../topic-details-modal/topic-details-modal.component';
import { EventBusService } from '../../../service/event-bus.service';
import { CreateTopicEvent, DeleteTopicEvent, HideTopicDetailsModalEvent, ShowTopicDetailsModalEvent, TopicCreatedEvent, TopicDeletedEvent, TopicUpdateddEvent } from '../topic-module.event';
import { TopicQueryService } from '../../../service/topic-query.service';
import { NGXLogger } from 'ngx-logger';
import { TopicFormComponent } from './topic-form/topic-form.component';


@Component({
  selector: 'topic-view',
  standalone: true,
  imports: [
    CommonModule,
    TopicListComponent,
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
    this.eventBus.listen([
      TopicCreatedEvent.name,
      TopicUpdateddEvent.name,
      TopicDeletedEvent.name
    ], (e: any) => {
      this.getTopics();
    });

    this.eventBus.listen(DeleteTopicEvent.name, (event: DeleteTopicEvent) => {
      this.topicService.delete(event.topicId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(TopicViewComponent.name, "Deleted Topic ", event.topicId);
          this.eventBus.emit(TopicDeletedEvent.name, new TopicDeletedEvent(event.topicId));
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
  
  showTopicForm() {
    this.logger.debug(TopicViewComponent.name, "toggleTopicForm()");
    this.eventBus.emit(CreateTopicEvent.name, new CreateTopicEvent());
  }
}
