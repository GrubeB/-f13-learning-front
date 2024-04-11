import { Component, Input, inject } from '@angular/core';
import { Comment } from '../../comment.model';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentListComponent } from '../comment-list.component';
import { CreateCommentReplayEvent } from '../../comment-module.event';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../service/event-bus.service';
import { AuthenticationService } from '../../../../auth/authentication.service';
import { ReferenceVotingService } from '../../../voting/reference-voting.service';
import { CommentVotingService } from '../../../voting/comment-voting.service';
import { CommentDislikedEvent, CommentLikeDislikRemovedEvent, CommentLikedEvent } from '../../../voting/voting-module.event';
import { CommentListItemContextMenuComponent } from './comment-list-item-context-menu/comment-list-item-context-menu.component';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';

@Component({
  selector: 'comment-list-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CommentListComponent,
    CommentListItemContextMenuComponent,
    UserProfile2Component,
  ],
  templateUrl: './comment-list-item.component.html',
  styleUrl: './comment-list-item.component.scss'
})
export class CommentListItemComponent {
  authenticationService = inject(AuthenticationService);
  votingService = inject(CommentVotingService);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);

  @Input() comment!: Comment;
  
  emitCreateCommentReplayEvent() {
    this.logger.debug(CommentListItemComponent.name, "emitCreateCommentReplayEvent");
    this.eventBus.emit(CreateCommentReplayEvent.name, new CreateCommentReplayEvent(this.comment.id));
  }
  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(CommentListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }
}
