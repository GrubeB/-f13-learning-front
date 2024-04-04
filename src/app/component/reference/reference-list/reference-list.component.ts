import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ReferenceItemComponent } from '../../reference/reference-item/reference-item.component';
import { EventBusService } from '../../../service/event-bus.service';
import { ReferenceCreateFormComponent } from '../reference-form/reference-form.component';
import { NGXLogger } from 'ngx-logger';
import { ReferenceCreatedEvent, ReferenceLikeDislikRemovedEvent, ReferenceDislikedEvent, ReferenceLikedEvent, CreateReferenceEvent } from '../../reference/reference-module.event';
import { Reference } from '../reference.model';
import { ReferenceFilterComponent, filters, sorters } from './reference-filter/reference-filter.component';
import { TopicDetailsFilterChangedEvent } from '../../topic/topic-module.event';
import { ReferenceItemContextMenuComponent } from '../reference-item/reference-item-context-menu/reference-item-context-menu.component';

@Component({
  selector: 'reference-list',
  standalone: true,
  imports: [
    CommonModule,
    ReferenceItemComponent,
    ReferenceFilterComponent,
    ReferenceItemContextMenuComponent
  ],
  templateUrl: './reference-list.component.html',
  styleUrl: './reference-list.component.scss'
})
export class ReferenceListComponent {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);

  @Input() references!: Reference[];

  filtredReferences() {
    return this.references.filter(this.activeFilter)?.sort(this.activeSorter)
  }

  activeFilter: any = filters[0];
  activeSorter: any = sorters[0];
  
  constructor(){
    this.eventBus.listen(TopicDetailsFilterChangedEvent.name, (e: TopicDetailsFilterChangedEvent) => {
      this.activeFilter = filters[e.filterIndex];
      this.activeSorter = sorters[e.sorterIndex];
    });
  }

  emitCreateReferenceEvent() {
    this.logger.debug(ReferenceListComponent.name, "emitCreateReferenceEvent()");
    this.eventBus.emit(CreateReferenceEvent.name, new CreateReferenceEvent());
  }
}
