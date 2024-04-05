import { Component, Input, inject } from '@angular/core';
import { Comment } from '../../category.model';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentListComponent } from '../comment-list.component';
import { CreateCommentReplayEvent } from '../../comment-module.event';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../service/event-bus.service';

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
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() comment!: Comment;
  
  emitCreateCommentReplayEvent() {
    this.logger.debug(CommentListItemComponent.name, "emitCreateCommentReplayEvent");
    this.eventBus.emit(CreateCommentReplayEvent.name, new CreateCommentReplayEvent(this.comment.id));
  }
}
