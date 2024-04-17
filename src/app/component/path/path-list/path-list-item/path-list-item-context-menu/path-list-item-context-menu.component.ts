import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { OutsideClickDirective } from '../../../../../shared/directive/outside-click.directive';
import { RouterLink } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../../shared/service/event-bus.service';
import { DeletePathEvent, UpdatePathEvent } from '../../../path-module.event';

@Component({
  selector: 'path-list-item-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective,
    RouterLink,
  ],
  templateUrl: './path-list-item-context-menu.component.html',
})
export class PathListItemContextMenuComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() modelId!: string;
  @Input() visable: boolean = false;
  @Output() visableChange = new EventEmitter<boolean>();

  hideMenu() {
    this.logger.debug(PathListItemContextMenuComponent.name, " hideMenu()");
    this.visable = false;
    this.visableChange.emit(this.visable);
  }
  
  emitDeleteEvent() {
    if (this.modelId) {
      this.logger.debug(PathListItemContextMenuComponent.name, " emitDeleteEvent()");
      this.eventBus.emit(DeletePathEvent.name, new DeletePathEvent(this.modelId));
      this.hideMenu();
    }
  }
  
  emitUpdateEvent() {
    if (this.modelId) {
      this.logger.debug(PathListItemContextMenuComponent.name, " emitUpdateEvent()");
      this.eventBus.emit(UpdatePathEvent.name, new UpdatePathEvent(this.modelId));
      this.hideMenu();
    }
  }
}
