import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OutsideClickDirective } from '../../../../../shared/directive/outside-click.directive';
import { EventBusService } from '../../../../service/event-bus.service';
import { DeleteReferenceEvent, EditReferenceEvent, ShowReferenceItemContextMenuEvent } from '../../reference-module.event';

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
export class ReferenceItemContextMenuComponent implements AfterViewInit{
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  referenceId?: string;
  menuVisable: boolean = false;
  @ViewChild('container') container!: ElementRef;

  constructor(private elementRef: ElementRef) {
    this.eventBus.listen(ShowReferenceItemContextMenuEvent.name, (event: ShowReferenceItemContextMenuEvent) => {
      this.referenceId = event.referenceId;
      let width = this.container.nativeElement.offsetWidth;
      this.showMenu(event.posX - width, event.posY);
    })
  }
  
  ngAfterViewInit(): void {
    this.hideMenu();
  }
  
  showMenu(x: number, y: number) {
    this.logger.debug(ReferenceItemContextMenuComponent.name, " showMenu()");
    this.container.nativeElement.style.left = `${x + 10}px`;
    this.container.nativeElement.style.top = `${y - 10}px`;
    this.menuVisable = true;
  }

  hideMenu() {
    this.logger.debug(ReferenceItemContextMenuComponent.name, " hideMenu()");
    this.container.nativeElement.style.left = `-10000px`;
    this.container.nativeElement.style.top = `-10000px`;
    this.menuVisable = false;
  }
  
  emitDeleteReferenceEvent() {
    if (this.referenceId) {
      this.logger.debug(ReferenceItemContextMenuComponent.name, " emitDeleteCategoryEvent()");
      this.eventBus.emit(DeleteReferenceEvent.name, new DeleteReferenceEvent(this.referenceId));
      this.hideMenu();
    }
  }
  emitEditReferenceEvent() {
    if (this.referenceId) {
      this.logger.debug(ReferenceItemContextMenuComponent.name, " emitEditCategoryEvent()");
      this.eventBus.emit(EditReferenceEvent.name, new EditReferenceEvent(this.referenceId));
      this.hideMenu();
    }
  }
}
