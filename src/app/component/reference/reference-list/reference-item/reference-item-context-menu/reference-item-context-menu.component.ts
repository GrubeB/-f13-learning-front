import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject, input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OutsideClickDirective } from '../../../../../shared/directive/outside-click.directive';
import { EventBusService } from '../../../../../shared/service/event-bus.service';
import { DeleteReferenceEvent, UpdateReferenceEvent } from '../../../reference-module.event';

@Component({
  selector: 'reference-item-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective,
    RouterLink,
  ],
  templateUrl: './reference-item-context-menu.component.html',
})
export class ReferenceItemContextMenuComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() modelId!: string;
  @Input() visable: boolean = false;
  @Output() visableChange = new EventEmitter<boolean>();

  hideMenu() {
    this.logger.debug(ReferenceItemContextMenuComponent.name, " hideMenu()");
    this.visable = false;
    this.visableChange.emit(this.visable);
  }
  
  emitDeleteReferenceEvent() {
    if (this.modelId) {
      this.logger.debug(ReferenceItemContextMenuComponent.name, " emitDeleteCategoryEvent()");
      this.eventBus.emit(DeleteReferenceEvent.name, new DeleteReferenceEvent(this.modelId));
      this.hideMenu();
    }
  }
  emitUpdateReferenceEvent() {
    if (this.modelId) {
      this.logger.debug(ReferenceItemContextMenuComponent.name, " emitEditCategoryEvent()");
      this.eventBus.emit(UpdateReferenceEvent.name, new UpdateReferenceEvent(this.modelId));
      this.hideMenu();
    }
  }
}
