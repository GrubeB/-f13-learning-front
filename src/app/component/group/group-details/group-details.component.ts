import { Component, Input, inject } from '@angular/core';
import { GroupService } from '../group.service';
import { GroupQueryService } from '../group-query.service';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { GroupCommentService } from '../../comment/group-comment.service';
import { Group } from '../group.model';
import { first } from 'rxjs';
import { CommentDislikedEvent, CommentLikeDislikRemovedEvent, CommentLikedEvent, ReferenceDislikedEvent, ReferenceLikeDislikRemovedEvent, ReferenceLikedEvent } from '../../voting/voting-module.event';
import { ReferenceCreatedEvent, ReferenceDeletedEvent, ReferenceUpdatedEvent } from '../../reference/reference-module.event';
import { CommentCreatedEvent, CommentDeletedEvent, CommentUpdatedEvent, DeleteCommentEvent } from '../../comment/comment-module.event';
import { CommonModule, DatePipe } from '@angular/common';
import { ReferenceItemComponent } from '../../reference/reference-list/reference-item/reference-item.component';
import { ReferenceFilterComponent } from '../../reference/reference-list/reference-filter/reference-filter.component';
import { ReferenceFormComponent } from '../../reference/reference-form/reference-form.component';
import { ReferenceListComponent } from '../../reference/reference-list/reference-list.component';
import { CommentListComponent } from '../../comment/comment-list/comment-list.component';
import { CommentFormComponent } from '../../comment/comment-form/comment-form.component';
import { UserProfile2Component } from '../../user/user-profile-2/user-profile-2.component';

@Component({
  selector: 'group-details',
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

  @Input() groupId!: string;
  group?: Group;

  constructor() {
    this.eventBus.listen(DeleteCommentEvent.name, (event: DeleteCommentEvent) => {
      this.commentService.delete(this.groupId, event.commentId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(GroupDetailsComponent.name, "Deleted comment ", event.commentId);
          this.eventBus.emit(CommentDeletedEvent.name, new CommentDeletedEvent(event.commentId));
        },
        error: e => {
          this.logger.debug(GroupDetailsComponent.name, "Error occured while deleting comment ", e);
        }
      })
    });

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
      this.refreshGroup();
    });
  }

  ngOnInit(): void {
    this.getGroup(this.groupId);
  }

  getGroup(id: string): void {
    this.logger.debug(GroupDetailsComponent.name, "getGroup()");
    this.queryService.get(id).pipe(first()).subscribe({
      next: data => {
        this.group = data;
        this.logger.debug(GroupDetailsComponent.name, "group: ", this.group);
      },
      error: e => {
      }
    });
  }
  refreshGroup() {
    this.logger.debug(GroupDetailsComponent.name, "refreshGroup()");
    this.getGroup(this.groupId);
  }
}
