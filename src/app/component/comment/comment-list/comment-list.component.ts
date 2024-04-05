import { Component, Input, inject } from '@angular/core';
import { Comment } from '../category.model';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentListItemComponent } from './comment-list-item/comment-list-item.component';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../service/event-bus.service';
import { CreateCommentEvent, CreateCommentReplayEvent } from '../comment-module.event';

@Component({
  selector: 'comment-list',
  standalone: true,
  imports: [
    CommonModule,
    CommentListItemComponent,
    DatePipe
  ],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() comments!: Comment[];

  emitCreateCommentEvent() {
    this.logger.debug(CommentListComponent.name, "emitCreateCommentEvent");
    this.eventBus.emit(CreateCommentEvent.name, new CreateCommentEvent());
  }
}
