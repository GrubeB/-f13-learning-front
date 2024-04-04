import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Topic } from '../../../topic.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventBusService } from '../../../../../service/event-bus.service';
import { ShowTopicDetailsModalEvent } from '../../../topic-module.event';
import { TopicListItemContextMenuComponent } from './topic-list-item-context-menu/topic-list-item-context-menu.component';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'topic-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    TopicListItemContextMenuComponent
  ],
  templateUrl: './topic-list-item.component.html',
  styleUrl: './topic-list-item.component.scss'
})
export class TopicListItemComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() topic!: Topic;

  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(TopicListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }
  
  openTopicDetailsModal(topicId: string) {
    this.logger.debug(TopicListItemComponent.name, " openTopicDetailsModal()");
    this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  }
}
