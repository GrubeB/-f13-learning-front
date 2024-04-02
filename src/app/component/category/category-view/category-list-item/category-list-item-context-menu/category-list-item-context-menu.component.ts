import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../../service/event-bus.service';
import { CommonModule } from '@angular/common';
import { OutsideClickDirective } from '../../../../../../shared/directive/outside-click.directive';
import { RouterLink } from '@angular/router';
import { DeleteCategoryEvent, ShowCategoryItemContextMenuEvent } from '../../../category-module.event';

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

  categoryId?: string;
  menuVisable: boolean = false;
  @ViewChild('container') container!: ElementRef;

  constructor(private elementRef: ElementRef) {
    this.eventBus.listen(ShowCategoryItemContextMenuEvent.name, (event: ShowCategoryItemContextMenuEvent) => {
      this.categoryId = event.categoryId;
      let width = this.container.nativeElement.offsetWidth;
      this.showMenu(event.posX - width, event.posY);
    })
  }

  ngAfterViewInit(): void {
    this.hideMenu();
  }

  showMenu(x: number, y: number) {
    this.logger.debug(CategoryListItemContextMenuComponent.name, " showMenu()");
    this.container.nativeElement.style.left = `${x + 10}px`;
    this.container.nativeElement.style.top = `${y - 10}px`;
    this.menuVisable = true;
  }

  hideMenu() {
    this.logger.debug(CategoryListItemContextMenuComponent.name, " hideMenu()");
    this.container.nativeElement.style.left = `-10000px`;
    this.container.nativeElement.style.top = `-10000px`;
    this.menuVisable = false;
  }
  
  emitDeleteCategoryEvent() {
    if (this.categoryId) {
      this.logger.debug(CategoryListItemContextMenuComponent.name, " emitDeleteCategoryEvent()");
      this.eventBus.emit(DeleteCategoryEvent.name, new DeleteCategoryEvent(this.categoryId));
      this.hideMenu();
    }
  }
}
