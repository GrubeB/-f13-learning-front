import { Component, Input, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../service/event-bus.service';
import { CreateReferenceCommand, Reference } from '../reference.model';
import { AbstractReferenceService } from '../abstract-reference.service';
import { CreateReferenceEvent, DeleteReferenceEvent, ReferenceCreatedEvent, ReferenceDeletedEvent, ReferenceUpdatedEvent, UpdateReferenceEvent } from '../reference-module.event';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReferenceFormComponent } from '../reference-form/reference-form.component';
import { ReferenceListComponent } from '../reference-list/reference-list.component';

@Component({
  selector: 'reference-section',
  standalone: true,
  imports: [
    CommonModule,
    ReferenceFormComponent,
    ReferenceListComponent,
  ],
  templateUrl: './reference-section.component.html',
  styleUrl: './reference-section.component.scss'
})
export class ReferenceSectionComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() modelId!: string;
  @Input() references!: Reference[];
  @Input() referenceService!: AbstractReferenceService;

  constructor() {
    this.eventBus.listen(DeleteReferenceEvent.name, (event: DeleteReferenceEvent) => {
      this.referenceService.delete(this.modelId, event.referenceId).pipe(first()).subscribe({
        next: data => {
          this.logger.debug(ReferenceSectionComponent.name, "Deleted reference ", event.referenceId);
          this.eventBus.emit(ReferenceDeletedEvent.name, new ReferenceDeletedEvent(event.referenceId));
        },
        error: e => {
          this.logger.debug(ReferenceSectionComponent.name, "Error occured while deleting reference ", e);
        }
      });
    });

    this.eventBus.listen([
      CreateReferenceEvent.name,
      UpdateReferenceEvent.name
    ], (event: any) => {
      this.changeTab(Tabs.FORM);
    });
    this.eventBus.listen([
      ReferenceCreatedEvent.name,
      ReferenceUpdatedEvent.name,
      ReferenceDeletedEvent.name,
    ], (event: any) => {
      this.changeTab(Tabs.LIST);
    });
  }

  emitCreateReferenceEvent() {
    this.eventBus.emit(CreateReferenceEvent.name, new CreateReferenceEvent());
  }

  // TABS
  tabs = [Tabs.LIST, Tabs.FORM];
  activeTab = this.tabs[0];
  changeTab(tabName: string) {
    this.logger.debug(ReferenceSectionComponent.name, "changeTab()");
    var tab : Tabs = Tabs[tabName as keyof typeof Tabs];
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