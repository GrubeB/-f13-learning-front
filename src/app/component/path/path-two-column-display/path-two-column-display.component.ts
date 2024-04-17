import { Component, Input, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CommonModule } from '@angular/common';
import { Path } from '../path.model';
import { TopicListItemComponent } from '../../topic/topic-list/topic-list-item/topic-list-item.component';
import { PathTwoColumnDisplayTopicComponent } from './path-two-column-display-topic/path-two-column-display-topic.component';
import { UserProfile2Component } from '../../user/user-profile-2/user-profile-2.component';
import { RouterLink } from '@angular/router';
import { ShowTopicDetailsModalEvent } from '../../topic/topic-module.event';
import { ShowGroupDetailsModalEvent } from '../../group/group-module.event';
import { TopicDetailsModalComponent } from '../../topic/topic-details-modal/topic-details-modal.component';
import { GroupDetailsModalComponent } from '../../group/group-details-modal/group-details-modal.component';
import { TopicProgressService } from '../../progress/topic-progress.service';
import { GroupProgressService } from '../../progress/group-progress.service';
import { ProgressSetComponent } from '../../progress/progress-setter/progress-setter.component';

@Component({
  selector: 'path-two-column-display',
  standalone: true,
  imports: [
    CommonModule,
    TopicListItemComponent,
    PathTwoColumnDisplayTopicComponent,
    UserProfile2Component,
    RouterLink,
    TopicDetailsModalComponent,
    GroupDetailsModalComponent,
    ProgressSetComponent,
  ],
  templateUrl: './path-two-column-display.component.html',
  styleUrl: './path-two-column-display.component.scss'
})
export class PathTwoColumnDisplayComponent implements OnInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  
  topicProgressService = inject(TopicProgressService);
  groupProgressService = inject(GroupProgressService);
  
  @Input() model!: Path;

  ngOnInit(): void {
  }
  getItems(): any[] {
    return [...this.model.topics, ...this.model.groups];
  }
  // MODAL 
  openTopicDetailsModal(topicId: string) {
    this.logger.debug(PathTwoColumnDisplayComponent.name, " openTopicDetailsModal()");
    this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  }
  openGroupDetailsModal(topicId: string) {
    this.logger.debug(PathTwoColumnDisplayComponent.name, " openGroupDetailsModal()");
    this.eventBus.emit(ShowGroupDetailsModalEvent.name, new ShowGroupDetailsModalEvent(topicId));
  }
}
