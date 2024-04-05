import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Topic } from '../topic.model';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../topic.service';
import { take } from 'rxjs';
import { ReferenceItemComponent } from '../../reference/reference-item/reference-item.component';
import { ReferenceFilterComponent } from '../../reference/reference-list/reference-filter/reference-filter.component';
import { filters, sorters } from '../../reference/reference-list/reference-filter/reference-filter.component';
import { EventBusService } from '../../../service/event-bus.service';
import { TopicDetailsFilterChangedEvent } from '../topic-module.event';
import { ReferenceCreateFormComponent } from '../../reference/reference-form/reference-form.component';
import { TopicQueryService } from '../topic-query.service';
import { NGXLogger } from 'ngx-logger';
import { ReferenceCreatedEvent, ReferenceLikeDislikRemovedEvent, ReferenceDislikedEvent, ReferenceLikedEvent, CreateReferenceEvent, ReferenceUpdatedEvent, ReferenceDeletedEvent } from '../../reference/reference-module.event';
import { ReferenceListComponent } from '../../reference/reference-list/reference-list.component';
import { CommentListComponent } from '../../comment/comment-list/comment-list.component';
import { TopicCommentService } from '../../comment/topic-comment.service';
import { CommentFormComponent } from '../../comment/comment-form/comment-form.component';

@Component({
  selector: 'topic-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReferenceItemComponent,
    ReferenceFilterComponent,
    ReferenceCreateFormComponent,
    ReferenceListComponent,
    CommentListComponent,
    CommentFormComponent
  ],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.scss'
})
export class TopicDetailsComponent implements OnInit {
  topicService = inject(TopicService);
  topicQueryService = inject(TopicQueryService);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  topicCommentService = inject(TopicCommentService);
  
  @Input() topicId!: string;
  topic?: Topic;
  
  activeFilter: any = filters[0];
  activeSorter: any = sorters[0];

  ngOnInit(): void {
    this.getTopic(this.topicId);
    this.eventBus.listen([
      ReferenceLikedEvent.name,
      ReferenceDislikedEvent.name,
      ReferenceLikeDislikRemovedEvent.name,
      
      ReferenceCreatedEvent.name,
      ReferenceUpdatedEvent.name,
      ReferenceDeletedEvent.name
    ], (e: any) => {
      this.refreshTopic(); 
    });
  }

  getTopic(id: string): void {
    this.logger.debug(TopicDetailsComponent.name, "getTopic()");
    this.topicQueryService.get(id).pipe(take(1)).subscribe({
      next: data => {
        this.topic = data;
        this.logger.debug(TopicDetailsComponent.name,"topic: ",  this.topic);
      },
      error: e => {
      }
    });
  }
  refreshTopic() {
    this.logger.debug(TopicDetailsComponent.name, "refreshTopic()");
    if(this.topic?.id) {
      this.getTopic(this.topic.id);
    }
  }
}
