import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { OutsideClickDirective } from '../../../../../../shared/directive/outside-click.directive';
import { RouterLink } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../../service/event-bus.service';
import { DeleteCommentEvent, UpdateCommentEvent } from '../../../comment-module.event';

@Component({
  selector: 'comment-list-item-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective,
    RouterLink,
  ],
  templateUrl: './comment-list-item-context-menu.component.html',
})
export class CommentListItemContextMenuComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() modelId!: string;
  @Input() visable: boolean = false;
  @Output() visableChange = new EventEmitter<boolean>();
  
  hideMenu() {
    this.logger.debug(CommentListItemContextMenuComponent.name, " hideMenu()");
    this.visable = false;
    this.visableChange.emit(this.visable);
  }
  
  emitDeleteEvent() {
    if (this.modelId) {
      this.logger.debug(CommentListItemContextMenuComponent.name, " emitDeleteEvent()");
      this.eventBus.emit(DeleteCommentEvent.name, new DeleteCommentEvent(this.modelId));
      this.hideMenu();
    }
  }
  emitUpdateEvent() {
    if (this.modelId) {
      this.logger.debug(CommentListItemContextMenuComponent.name, " emitUpdateEvent()");
      this.eventBus.emit(UpdateCommentEvent.name, new UpdateCommentEvent(this.modelId));
      this.hideMenu();
    }
  }
}
