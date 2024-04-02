import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventBusService } from '../../../service/event-bus.service';
import { ShowTopicDetailsModalEvent, ShowTopicItemContextMenuEvent } from '../topic-module.event';
import { TopicListItemContextMenuComponent } from './topic-list-item-context-menu/topic-list-item-context-menu.component';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'topics-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    TopicListItemContextMenuComponent
  ],
  templateUrl: './topics-list-item.component.html',
  styleUrl: './topics-list-item.component.scss'
})
export class TopicsListItemComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() topic!: Topic;

  openTopicDetailsModal(topicId: string) {
    this.logger.debug(TopicsListItemComponent.name, " openTopicDetailsModal()");
    this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  }

  openContextMenu(event: any) {
    this.logger.debug(TopicsListItemComponent.name, " openContextMenu()");
    this.eventBus.emit(ShowTopicItemContextMenuEvent.name, new ShowTopicItemContextMenuEvent(
      this.topic.id, event.clientX, event.clientY
    ))
  }
}
