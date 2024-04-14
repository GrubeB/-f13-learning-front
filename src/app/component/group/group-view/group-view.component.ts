import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { GroupQueryService } from '../group-query.service';
import { GroupService } from '../group.service';
import { Group } from '../group.model';
import { first } from 'rxjs';
import { CreateGroupEvent, DeleteGroupEvent, GroupCreatedEvent, GroupDeletedEvent, GroupUpdateddEvent, UpdateGroupEvent } from '../group-module.event';
import { GroupListComponent } from '../group-list/group-list.component';
import { GroupFormComponent } from '../group-form/group-form.component';

@Component({
  selector: 'group-view',
  standalone: true,
  imports: [
    CommonModule,
    GroupListComponent,
    GroupFormComponent,
  ],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.scss'
})
export class GroupViewComponent implements OnInit {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  groupQueryService = inject(GroupQueryService);
  groupService = inject(GroupService);

  items: Group[] = [];

  constructor() {
    this.eventBus.listen([
      GroupCreatedEvent.name,
      GroupUpdateddEvent.name,
      GroupDeletedEvent.name
    ], (e: any) => {
      this.getItems();
      this.changeTab(Tabs.LIST);
    });
    this.eventBus.listen([
      UpdateGroupEvent.name,
      CreateGroupEvent.name
    ], (event: any) => {
      this.changeTab(Tabs.FORM);
    });
    this.eventBus.listen(DeleteGroupEvent.name, (event: DeleteGroupEvent) => {
      this.groupService.delete(event.modelId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(GroupViewComponent.name, " Deleted group ", event.modelId);
          this.eventBus.emit(GroupDeletedEvent.name, new GroupDeletedEvent(event.modelId));
        },
        error: e => {
          this.logger.debug(GroupViewComponent.name, " Error occured while deleting group ", e);
        }
      });
    });
  }

  ngOnInit(): void {
    this.getItems();
    this.changeTab(Tabs.LIST);
  }

  getItems() {
    this.logger.debug(GroupViewComponent.name, " getItems()");
    this.groupQueryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.items = data.content;
      },
      error: e => {
        this.items = [];
      }
    });
  }

  showForm() {
    this.logger.debug(GroupViewComponent.name, " showForm()");
    this.eventBus.emit(CreateGroupEvent.name, new CreateGroupEvent());
  }

  // TABS
  tabs = [Tabs.LIST, Tabs.FORM];
  activeTab = this.tabs[0];
  changeTab(tabName: string) {
    this.logger.debug(GroupViewComponent.name, "changeTab()");
    var tab: Tabs = Tabs[tabName as keyof typeof Tabs];
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