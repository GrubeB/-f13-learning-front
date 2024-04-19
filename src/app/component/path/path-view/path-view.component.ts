import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { first, take } from 'rxjs';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { PathQueryService } from '../path-query.service';
import { PathService } from '../path.service';
import { Path } from '../path.model';
import { CreatePathEvent, DeletePathEvent, PathCreatedEvent, PathDeletedEvent, PathUpdateddEvent, UpdatePathEvent } from '../path-module.event';
import { PathListComponent } from '../path-list/path-list.component';
import { PathDetailsModalComponent } from '../path-details-modal/path-details-modal.component';
import { PathFormComponent } from '../path-form/path-form.component';

@Component({
  selector: 'path-view',
  standalone: true,
  imports: [
    CommonModule,
    PathListComponent,
    PathDetailsModalComponent,
    PathFormComponent,
  ],
  templateUrl: './path-view.component.html',
  styleUrl: './path-view.component.scss'
})
export class PathViewComponent {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  queryService = inject(PathQueryService);
  service = inject(PathService);

  items: Path[] = [];

  constructor() {
    this.eventBus.listen([
      PathCreatedEvent.name,
      PathUpdateddEvent.name,
      PathDeletedEvent.name
    ], (e: any) => {
      this.getItems();
      this.changeTab(Tabs.LIST);
    });
    this.eventBus.listen([
      UpdatePathEvent.name,
      CreatePathEvent.name
    ], (event: any) => {
      this.changeTab(Tabs.FORM);
    });
    this.eventBus.listen(DeletePathEvent.name, (event: DeletePathEvent) => {
      this.service.delete(event.modelId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(PathViewComponent.name, " Deleted path ", event.modelId);
          this.eventBus.emit(PathDeletedEvent.name, new PathDeletedEvent(event.modelId));
        },
        error: e => {
          this.logger.debug(PathViewComponent.name, " Error occured while deleting path ", e);
        }
      });
    });
  }

  ngOnInit(): void {
    this.getItems();
    this.changeTab(Tabs.LIST);
  }

  getItems() {
    this.logger.debug(PathViewComponent.name, " getItems()");
    this.queryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.items = data.content;
      },
      error: e => {
        this.items = [];
      }
    });
  }

  showForm() {
    this.logger.debug(PathViewComponent.name, " showForm()");
    this.eventBus.emit(CreatePathEvent.name, new CreatePathEvent());
  }

  // TABS
  tabs = [Tabs.LIST, Tabs.FORM];
  activeTab = this.tabs[0];
  changeTab(tabName: string) {
    this.logger.debug(PathViewComponent.name, "changeTab()");
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