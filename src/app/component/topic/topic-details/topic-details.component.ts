import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Topic } from '../topic.model';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../topic.service';
import { first, take } from 'rxjs';
import { ReferenceItemComponent } from '../../reference/reference-list/reference-item/reference-item.component';
import { ReferenceFilterComponent } from '../../reference/reference-list/reference-filter/reference-filter.component';
import { EventBusService } from '../../../service/event-bus.service';
import { ReferenceFormComponent } from '../../reference/reference-form/reference-form.component';
import { TopicQueryService } from '../topic-query.service';
import { NGXLogger } from 'ngx-logger';
import { ReferenceCreatedEvent, ReferenceUpdatedEvent, ReferenceDeletedEvent } from '../../reference/reference-module.event';
import { ReferenceListComponent } from '../../reference/reference-list/reference-list.component';
import { CommentListComponent } from '../../comment/comment-list/comment-list.component';
import { TopicCommentService } from '../../comment/topic-comment.service';
import { CommentFormComponent } from '../../comment/comment-form/comment-form.component';
import { CommentCreatedEvent, CommentDeletedEvent, CommentUpdatedEvent, DeleteCommentEvent } from '../../comment/comment-module.event';
import { CommentDislikedEvent, CommentLikeDislikRemovedEvent, CommentLikedEvent, ReferenceDislikedEvent, ReferenceLikeDislikRemovedEvent, ReferenceLikedEvent } from '../../voting/voting-module.event';
import { UserProfile2Component } from '../../user/user-profile-2/user-profile-2.component';
import { CommentSectionComponent } from '../../comment/comment-section/comment-section.component';
import { ReferenceSectionComponent } from '../../reference/reference-section/reference-section.component';
import { TopicReferenceService } from '../../reference/topic-reference.service';

@Component({
  selector: 'topic-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReferenceItemComponent,
    ReferenceFilterComponent,
    ReferenceFormComponent,
    ReferenceListComponent,
    CommentListComponent,
    CommentFormComponent,
    UserProfile2Component,
    CommentSectionComponent,
    ReferenceSectionComponent,
  ],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.scss'
})
export class TopicDetailsComponent implements OnInit {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  service = inject(TopicService);
  queryService = inject(TopicQueryService);
  commentService = inject(TopicCommentService);
  referenceService = inject(TopicReferenceService);

  @Input() topicId!: string;
  topic?: Topic;

  constructor() {
    this.eventBus.listen([
      ReferenceLikedEvent.name,
      ReferenceDislikedEvent.name,
      ReferenceLikeDislikRemovedEvent.name,
      ReferenceCreatedEvent.name,
      ReferenceUpdatedEvent.name,
      ReferenceDeletedEvent.name,

      CommentCreatedEvent.name,
      CommentUpdatedEvent.name,
      CommentDeletedEvent.name,

      CommentLikedEvent.name,
      CommentDislikedEvent.name,
      CommentLikeDislikRemovedEvent.name,
    ], (event: any) => {
      this.getTopic(this.topicId);
    });
  }

  ngOnInit(): void {
    this.getTopic(this.topicId);
  }

  getTopic(id: string): void {
    this.logger.debug(TopicDetailsComponent.name, "getTopic()");
    this.queryService.get(id).pipe(take(1)).subscribe({
      next: data => {
        this.topic = data;
        this.logger.debug(TopicDetailsComponent.name, "topic: ", this.topic);
      },
      error: e => {
      }
    });
  }
}
