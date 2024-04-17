import { Component, Input, inject } from '@angular/core';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { GroupCommentService } from '../../comment/group-comment.service';
import { first } from 'rxjs';
import { CommentDisLikeRemvedEvent, CommentDislikedEvent, CommentLikeDislikRemovedEvent, CommentLikeRemvedEvent, CommentLikedEvent, ReferenceDislikedEvent, ReferenceLikeDislikRemovedEvent, ReferenceLikedEvent } from '../../voting/voting-module.event';
import { ReferenceCreatedEvent, ReferenceDeletedEvent, ReferenceUpdatedEvent } from '../../reference/reference-module.event';
import { CommentCreatedEvent, CommentDeletedEvent, CommentUpdatedEvent } from '../../comment/comment-module.event';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfile2Component } from '../../user/user-profile-2/user-profile-2.component';
import { CommentSectionComponent } from '../../comment/comment-section/comment-section.component';
import { ReferenceSectionComponent } from '../../reference/reference-section/reference-section.component';
import { GroupReferenceService } from '../../reference/group-reference.service';
import { CategorySectionComponent } from '../../category/category-section/category-section.component';
import { TopicSectionComponent } from '../../topic/topic-section/topic-section.component';
import { ProgressSetComponent } from '../../progress/progress-setter/progress-setter.component';
import { GroupProgressService } from '../../progress/group-progress.service';
import { GroupService } from '../../group/group.service';
import { GroupQueryService } from '../../group/group-query.service';
import { PathService } from '../path.service';
import { PathQueryService } from '../path-query.service';
import { PathCommentService } from '../../comment/path-comment.service';
import { PathProgressService } from '../../progress/path-progress.service';
import { Path } from '../path.model';
import { PathItemsSectionComponent } from '../path-items-section/path-items-section.component';

@Component({
  selector: 'path-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    UserProfile2Component,
    CommentSectionComponent,
    CategorySectionComponent,
    ProgressSetComponent,
    PathItemsSectionComponent,
  ],
  templateUrl: './path-details.component.html',
  styleUrl: './path-details.component.scss'
})
export class PathDetailsComponent {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  service = inject(PathService);
  queryService = inject(PathQueryService);
  commentService = inject(PathCommentService);
  progressService = inject(PathProgressService);

  @Input() modelId!: string;
  model?: Path;

  constructor() {
    this.eventBus.listen([
      CommentCreatedEvent.name,
      CommentUpdatedEvent.name,
      CommentDeletedEvent.name,

      CommentLikedEvent.name,
      CommentLikeRemvedEvent.name,
      CommentDislikedEvent.name,
      CommentDisLikeRemvedEvent.name,
      CommentLikeDislikRemovedEvent.name,
    ], (event: any) => {
      this.getModel(this.modelId);
    });
  }

  ngOnInit(): void {
    this.getModel(this.modelId);
  }

  getModel(id: string): void {
    this.logger.debug(PathDetailsComponent.name, "getModel()");
    this.queryService.get(id).pipe(first()).subscribe({
      next: data => {
        this.model = data;
        this.logger.debug(PathDetailsComponent.name, "model: ", this.model);
      },
      error: e => {
      }
    });
  }
}
