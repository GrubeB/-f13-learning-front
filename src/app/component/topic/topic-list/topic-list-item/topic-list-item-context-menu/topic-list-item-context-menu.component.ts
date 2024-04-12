import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../../shared/service/event-bus.service';
import { DeleteTopicEvent, UpdateTopicEvent } from '../../../topic-module.event';
import { CommonModule } from '@angular/common';
import { OutsideClickDirective } from '../../../../../shared/directive/outside-click.directive';
import { RouterLink } from '@angular/router';
import { UpdateTopicCommand } from '../../../topic.model';

@Component({
  selector: 'topic-list-item-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective,
    RouterLink,
  ],
  templateUrl: './topic-list-item-context-menu.component.html',
})
export class TopicListItemContextMenuComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() modelId!: string;
  @Input() visable: boolean = false;
  @Output() visableChange = new EventEmitter<boolean>();

  hideMenu() {
    this.logger.debug(TopicListItemContextMenuComponent.name, " hideMenu()");
    this.visable = false;
    this.visableChange.emit(this.visable);
  }
  
  
  emitDeleteEvent() {
    if (this.modelId) {
      this.logger.debug(TopicListItemContextMenuComponent.name, " emitDeleteEvent()");
      this.eventBus.emit(DeleteTopicEvent.name, new DeleteTopicEvent(this.modelId));
      this.hideMenu();
    }
  }
  
  emitUpdateEvent() {
    if (this.modelId) {
      this.logger.debug(TopicListItemContextMenuComponent.name, " emitUpdateEvent()");
      this.eventBus.emit(UpdateTopicEvent.name, new UpdateTopicEvent(this.modelId));
      this.hideMenu();
    }
  }
}
