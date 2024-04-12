import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OutsideClickDirective } from '../../../../../shared/directive/outside-click.directive';
import { EventBusService } from '../../../../../shared/service/event-bus.service';
import { DeleteCategoryEvent, UpdateCategoryEvent } from '../../../category-module.event';
import { CategoryLikeRemvedEvent, CategoryLikedEvent } from '../../../../voting/voting-module.event';

@Component({
  selector: 'category-list-item-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective,
    RouterLink,
  ],
  templateUrl: './category-list-item-context-menu.component.html',
})
export class CategoryListItemContextMenuComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  @Input() modelId!: string;
  @Input() visable: boolean = false;
  @Output() visableChange = new EventEmitter<boolean>();
  
  hideMenu() {
    this.logger.debug(CategoryListItemContextMenuComponent.name, " hideMenu()");
    this.visable = false;
    this.visableChange.emit(this.visable);
  }
  
  emitDeleteCategoryEvent() {
    if (this.modelId) {
      this.logger.debug(CategoryListItemContextMenuComponent.name, " emitDeleteCategoryEvent()");
      this.eventBus.emit(DeleteCategoryEvent.name, new DeleteCategoryEvent(this.modelId));
      this.hideMenu();
    }
  }

  emitEditCategoryEvent() {
    if (this.modelId) {
      this.logger.debug(CategoryListItemContextMenuComponent.name, " emitEditCategoryEvent()");
      this.eventBus.emit(UpdateCategoryEvent.name, new UpdateCategoryEvent(this.modelId));
      this.hideMenu();
    }
  }

  emitCategoryLikedEvent() {
    if (this.modelId) {
      this.logger.debug(CategoryListItemContextMenuComponent.name, " emitCategoryLikedEvent()");
      this.eventBus.emit(CategoryLikedEvent.name, new CategoryLikedEvent(this.modelId));
      this.hideMenu();
    }
  }
  
  emitCategoryLikeRemvedEvent() {
    if (this.modelId) {
      this.logger.debug(CategoryListItemContextMenuComponent.name, " emitCategoryLikeRemvedEvent()");
      this.eventBus.emit(CategoryLikeRemvedEvent.name, new CategoryLikeRemvedEvent(this.modelId));
      this.hideMenu();
    }
  }
}
