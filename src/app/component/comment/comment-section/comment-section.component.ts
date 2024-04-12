import { Component, Input, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { Comment } from '../comment.model';
import { AbstractCommentService } from '../abstract-comment.service';
import { CommonModule } from '@angular/common';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { CommentCreatedEvent, CommentDeletedEvent, CommentUpdatedEvent, CreateCommentEvent, CreateCommentReplayEvent, DeleteCommentEvent, UpdateCommentEvent } from '../comment-module.event';
import { first } from 'rxjs';
import { SwitchButtonComponent } from '../../../shared/component/switch-button/switch-button.component';
@Component({
  selector: 'comment-section',
  standalone: true,
  imports: [
    CommonModule,
    CommentFormComponent,
    CommentListComponent,
    SwitchButtonComponent,
  ],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss'
})
export class CommentSectionComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() modelId!: string;
  @Input() comments!: Comment[];
  @Input() commentService!: AbstractCommentService;

  constructor() {
    this.eventBus.listen(DeleteCommentEvent.name, (event: DeleteCommentEvent) => {
      this.commentService.delete(this.modelId, event.commentId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(CommentSectionComponent.name, "Deleted comment ", event.commentId);
          this.eventBus.emit(CommentDeletedEvent.name, new CommentDeletedEvent(event.commentId));
        },
        error: e => {
          this.logger.debug(CommentSectionComponent.name, "Error occured while deleting comment ", e);
        }
      })
    });
    this.eventBus.listen([
      CreateCommentEvent.name,
      CreateCommentReplayEvent.name,
      UpdateCommentEvent.name
    ], (event: any) => {
      this.changeTab(Tabs.FORM);
    });
    this.eventBus.listen([
      CommentCreatedEvent.name,
      CommentUpdatedEvent.name,
      CommentDeletedEvent.name,
    ], (event: any) => {
      this.changeTab(Tabs.LIST);
    });
  }

  emitCreateCommentEvent() {
    this.eventBus.emit(CreateCommentEvent.name, new CreateCommentEvent());
  }
  
  // HIDDE CONTENT
  contentHidden: boolean = false;

  // TABS
  tabs = [Tabs.LIST, Tabs.FORM];
  activeTab = this.tabs[0];
  changeTab(tabName: string) {
    this.logger.debug(CommentSectionComponent.name, "changeTab()");
    var tab : Tabs = Tabs[tabName as keyof typeof Tabs];
    if (tab && this.tabs.includes(tab)) {
      let index = this.tabs.indexOf(tab);
      this.activeTab = this.tabs[index];
    }
  };
}
enum Tabs {
  LIST = "LIST",
  FORM = "FORM",
}