import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CategoryListItemContextMenuComponent } from './category-list-item-context-menu/category-list-item-context-menu.component';
import { EventBusService } from '../../../../service/event-bus.service';
import { Category } from '../../category.model';
import { ShowCategoryItemContextMenuEvent } from '../../category-module.event';

@Component({
  selector: 'category-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    CategoryListItemContextMenuComponent
  ],
  templateUrl: './category-list-item.component.html',
  styleUrl: './category-list-item.component.scss'
})
export class CategoriesListItemComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  
  @Input() category!: Category;

  
  openContextMenu(event: any) {
    this.logger.debug(CategoriesListItemComponent.name, " openContextMenu()");
    this.eventBus.emit(ShowCategoryItemContextMenuEvent.name, new ShowCategoryItemContextMenuEvent(
      this.category.id, event.clientX, event.clientY
    ))
  }
}
