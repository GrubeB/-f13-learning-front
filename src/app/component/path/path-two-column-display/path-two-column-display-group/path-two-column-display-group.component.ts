import { Component, Input, inject } from '@angular/core';
import { PathItem } from '../../path.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';
import { ProgressSetComponent } from '../../../progress/progress-setter/progress-setter.component';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { GroupProgressService } from '../../../progress/group-progress.service';
import { ShowGroupDetailsModalEvent } from '../../../group/group-module.event';
import { Group } from '../../../group/group.model';
import { PathTwoColumnDisplayGroupSelectedEvent } from '../../path-module.event';
import { GroupQueryService } from '../../../group/group-query.service';
import { first } from 'rxjs';

@Component({
  selector: 'path-two-column-display-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    UserProfile2Component,
    ProgressSetComponent,
  ],
  templateUrl: './path-two-column-display-group.component.html',
  styleUrl: './path-two-column-display-group.component.scss'
})
export class PathTwoColumnDisplayGroupComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  groupQueryService = inject(GroupQueryService);
  groupProgressService = inject(GroupProgressService);

  @Input() pathItem?: PathItem;
  group?: Group;
  @Input() set groupId(id: string) {
    this.groupQueryService.get(id).pipe(first()).subscribe({
      next: data => {
        this.group = data;
      }
    });
  }

  selectGroup() {
    this.logger.debug(PathTwoColumnDisplayGroupComponent.name, " selectGroup()", this.group?.id);
    if (this.group) {
      this.eventBus.emit(PathTwoColumnDisplayGroupSelectedEvent.name, new PathTwoColumnDisplayGroupSelectedEvent(this.group.id));
    }
  }

  // MODAL 
  openGroupDetailsModal(groupId: string) {
    this.logger.debug(PathTwoColumnDisplayGroupComponent.name, " openGroupDetailsModal()");
    this.eventBus.emit(ShowGroupDetailsModalEvent.name, new ShowGroupDetailsModalEvent(groupId));
  }
}
