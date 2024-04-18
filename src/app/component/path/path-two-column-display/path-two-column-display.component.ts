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
import { Group } from '../../group/group.model';
import { PathTwoColumnDisplayGroupComponent } from './path-two-column-display-group/path-two-column-display-group.component';
import { PathTwoColumnDisplayGroupSelectedEvent } from '../path-module.event';
import { GroupQueryService } from '../../group/group-query.service';
import { first } from 'rxjs';

@Component({
  selector: 'path-two-column-display',
  standalone: true,
  imports: [
    CommonModule,
    TopicListItemComponent,
    PathTwoColumnDisplayTopicComponent,
    PathTwoColumnDisplayGroupComponent,
    UserProfile2Component,
    RouterLink,
    TopicDetailsModalComponent,
    GroupDetailsModalComponent,
  ],
  templateUrl: './path-two-column-display.component.html',
  styleUrl: './path-two-column-display.component.scss'
})
export class PathTwoColumnDisplayComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  groupQueryService = inject(GroupQueryService)

  @Input() model!: Path;

  constructor() {
    this.eventBus.listen(PathTwoColumnDisplayGroupSelectedEvent.name, (event: PathTwoColumnDisplayGroupSelectedEvent) => {
      this.selectGroup(event.groupId);
    });

  }

  // GROUP
  selectedGroupId?: string;
  selectedGroup?: Group;
  selectedGroupIdList: string[] = [];
  selectGroup(groupId: string) {
    if (this.selectedGroupId === groupId) {
      return
    }
    if (this.selectedGroupIdList.includes(groupId)) {
      this.selectedGroupIdList.splice(this.selectedGroupIdList.indexOf(groupId));
    }
    this.selectedGroupIdList.push(groupId);
    this.selectedGroupId = groupId;
    this.groupQueryService.get(this.selectedGroupId).pipe(first()).subscribe({
      next: data => {
        this.selectedGroup = data;
      }
    });
  }
  goBack() {
    const selected = this.selectedGroupIdList.pop();
    const prev = this.selectedGroupIdList[this.selectedGroupIdList.length - 1];
    if (prev) {
      this.selectGroup(prev);
    }
  }
  getRootGroups(): Group[] {
    return this.model.groups.map(pathItem => pathItem.entity as Group);
  }
  // ITEMS
  getItems(): any[] {
    return [...this.model.topics, ...this.model.groups].sort((i1, i2) => i1.number - i2.number);
  }
}
