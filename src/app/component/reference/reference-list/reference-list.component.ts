import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ReferenceItemComponent } from './reference-item/reference-item.component';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { CreateReferenceEvent } from '../../reference/reference-module.event';
import { Reference } from '../reference.model';
import { ReferenceFilterComponent, } from './reference-filter/reference-filter.component';
import { ReferenceItemContextMenuComponent } from './reference-item/reference-item-context-menu/reference-item-context-menu.component';

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
  filtredReference!: Reference[];

  emitCreateReferenceEvent() {
    this.logger.debug(ReferenceListComponent.name, "emitCreateReferenceEvent()");
    this.eventBus.emit(CreateReferenceEvent.name, new CreateReferenceEvent());
  }
}
