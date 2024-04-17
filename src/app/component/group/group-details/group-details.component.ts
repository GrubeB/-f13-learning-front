import { Component, Input, inject } from '@angular/core';
import { GroupService } from '../group.service';
import { GroupQueryService } from '../group-query.service';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { GroupCommentService } from '../../comment/group-comment.service';
import { Group } from '../group.model';
import { first } from 'rxjs';
import { ReferenceCreatedEvent, ReferenceDeletedEvent, ReferenceUpdatedEvent } from '../../reference/reference-module.event';
import { CommentCreatedEvent, CommentDeletedEvent, CommentUpdatedEvent } from '../../comment/comment-module.event';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfile2Component } from '../../user/user-profile-2/user-profile-2.component';
import { CommentSectionComponent } from '../../comment/comment-section/comment-section.component';
import { ReferenceSectionComponent } from '../../reference/reference-section/reference-section.component';
import { GroupReferenceService } from '../../reference/group-reference.service';
import { CategorySectionComponent } from '../../category/category-section/category-section.component';
import { TopicSectionComponent } from '../../topic/topic-section/topic-section.component';
import { GroupSectionComponent } from '../group-section/group-section.component';
import { ProgressSetComponent } from '../../progress/progress-setter/progress-setter.component';
import { GroupProgressService } from '../../progress/group-progress.service';
import { DisLikeRemvedEvent, DislikedEvent, LikeDislikRemovedEvent, LikeRemvedEvent, LikedEvent } from '../../voting/voting-module.event';

@Component({
  selector: 'group-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    UserProfile2Component,
    CommentSectionComponent,
    ReferenceSectionComponent,
    CategorySectionComponent,
    TopicSectionComponent,
    GroupSectionComponent,
    ProgressSetComponent,
  ],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss'
})
export class GroupDetailsComponent {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  service = inject(GroupService);
  queryService = inject(GroupQueryService);
  commentService = inject(GroupCommentService);
  referenceService = inject(GroupReferenceService);
  progressService = inject(GroupProgressService);

  @Input() modelId!: string;
  model?: Group;

  constructor() {
    this.eventBus.listen([
      ReferenceCreatedEvent.name,
      ReferenceUpdatedEvent.name,
      ReferenceDeletedEvent.name,

      CommentCreatedEvent.name,
      CommentUpdatedEvent.name,
      CommentDeletedEvent.name,

      LikedEvent.name,
      LikeRemvedEvent.name,
      DislikedEvent.name,
      DisLikeRemvedEvent.name,
      LikeDislikRemovedEvent.name,
    ], (event: any) => {
      this.getModel(this.modelId);
    });
  }

  ngOnInit(): void {
    this.getModel(this.modelId);
  }

  getModel(id: string): void {
    this.logger.debug(GroupDetailsComponent.name, "getModel()");
    this.queryService.get(id).pipe(first()).subscribe({
      next: data => {
        this.model = data;
        this.logger.debug(GroupDetailsComponent.name, "model: ", this.model);
      },
      error: e => {
      }
    });
  }
}
