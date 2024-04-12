import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { GroupQueryService } from '../group-query.service';
import { GroupService } from '../group.service';
import { Group } from '../group.model';
import { first } from 'rxjs';
import { CreateGroupEvent } from '../group-module.event';
import { GroupListComponent } from './group-list/group-list.component';

@Component({
  selector: 'group-view',
  standalone: true,
  imports: [
    CommonModule,
    GroupListComponent
  ],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.scss'
})
export class GroupViewComponent {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  groupQueryService = inject(GroupQueryService);
  groupService = inject(GroupService);

  groups: Group[] = [];

  constructor(){
    // TODO listen to events
  }

  ngOnInit(): void {
    this.getGroups();
  }
  getGroups() {
    this.logger.debug(GroupViewComponent.name, " getGroups()");
    this.groupQueryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.groups = data.content;
      },
      error: e => {
        this.groups = [];
      }
    });
  }
  
  showTopicForm() {
    this.logger.debug(GroupViewComponent.name, " toggleTopicForm()");
    this.eventBus.emit(CreateGroupEvent.name, new CreateGroupEvent());
  }
}
