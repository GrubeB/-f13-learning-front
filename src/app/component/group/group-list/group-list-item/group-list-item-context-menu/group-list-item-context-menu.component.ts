import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { OutsideClickDirective } from '../../../../../shared/directive/outside-click.directive';
import { RouterLink } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../../shared/service/event-bus.service';
import { DeleteGroupEvent, UpdateGroupEvent } from '../../../group-module.event';

@Component({
  selector: 'group-list-item-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective,
    RouterLink,
  ],
  templateUrl: './group-list-item-context-menu.component.html',
})
export class GroupListItemContextMenuComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() modelId!: string;
  @Input() visable: boolean = false;
  @Output() visableChange = new EventEmitter<boolean>();

  hideMenu() {
    this.logger.debug(GroupListItemContextMenuComponent.name, " hideMenu()");
    this.visable = false;
    this.visableChange.emit(this.visable);
  }
  
  emitDeleteEvent() {
    if (this.modelId) {
      this.logger.debug(GroupListItemContextMenuComponent.name, " emitDeleteEvent()");
      this.eventBus.emit(DeleteGroupEvent.name, new DeleteGroupEvent(this.modelId));
      this.hideMenu();
    }
  }
  
  emitUpdateEvent() {
    if (this.modelId) {
      this.logger.debug(GroupListItemContextMenuComponent.name, " emitUpdateEvent()");
      this.eventBus.emit(UpdateGroupEvent.name, new UpdateGroupEvent(this.modelId));
      this.hideMenu();
    }
  }
}
