import { Component, Input, inject } from '@angular/core';
import { Comment } from '../../category.model';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentListComponent } from '../comment-list.component';
import { CreateCommentReplayEvent } from '../../comment-module.event';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../service/event-bus.service';
import { AuthenticationService } from '../../../../auth/authentication.service';
import { ReferenceVotingService } from '../../../voting/reference-voting.service';
import { CommentVotingService } from '../../../voting/comment-voting.service';
import { CommentDislikedEvent, CommentLikeDislikRemovedEvent, CommentLikedEvent } from '../../../voting/voting-module.event';

@Component({
  selector: 'comment-list-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CommentListComponent
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

  like(id: string) {
    this.logger.debug(CommentListItemComponent.name, " like()");
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.createLike(id, userId).subscribe({
            next: res => {
              this.logger.debug(CommentListItemComponent.name, " User give like ");
              this.eventBus.emit(CommentLikedEvent.name, new CommentLikedEvent(id, userId));
            }
          });
        }
      }
    });
  }

  dislike(id: string) {
    this.logger.debug(CommentListItemComponent.name, " dislike()");
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.createDislike(id, userId).subscribe({
            next: res => {
              this.logger.debug(CommentListItemComponent.name, " User give dislike ");
              this.eventBus.emit(CommentDislikedEvent.name, new CommentDislikedEvent(id, userId));
            }
          });
        }
      }
    });
  }
  removeLikeDislike(id: string) {
    this.logger.debug(CommentListItemComponent.name, " removeLikeDislike()");
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.deleteLikeAndDislike(id, userId).subscribe({
            next: res => {
              this.logger.debug(CommentListItemComponent.name, " User removed like/dislike ");
              this.eventBus.emit(CommentLikeDislikRemovedEvent.name, new CommentLikeDislikRemovedEvent(id, userId));
            }
          });
        }
      }
    });
  }
}
