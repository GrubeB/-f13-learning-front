import { Component, Input, inject } from '@angular/core';
import { PathItem } from '../../path.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';
import { ProgressSetComponent } from '../../../progress/progress-setter/progress-setter.component';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { ShowTopicDetailsModalEvent } from '../../../topic/topic-module.event';
import { TopicProgressService } from '../../../progress/topic-progress.service';
import { Topic } from '../../../topic/topic.model';

@Component({
  selector: 'path-two-column-display-topic',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    UserProfile2Component,
    ProgressSetComponent,
  ],
  templateUrl: './path-two-column-display-topic.component.html',
  styleUrl: './path-two-column-display-topic.component.scss'
})
export class PathTwoColumnDisplayTopicComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  topicProgressService = inject(TopicProgressService);

  @Input() pathItem?: PathItem;
  @Input() topic!: Topic;

   // MODAL 
   openTopicDetailsModal(topicId: string) {
    this.logger.debug(PathTwoColumnDisplayTopicComponent.name, " openTopicDetailsModal()");
    this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  }
}
