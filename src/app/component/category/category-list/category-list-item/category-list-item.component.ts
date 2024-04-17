import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CategoryListItemContextMenuComponent } from './category-list-item-context-menu/category-list-item-context-menu.component';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { Category } from '../../category.model';
import { CategoryVotingService } from '../../../voting/category-voting.service';
import { DomainObjectType, Vote } from '../../../voting/vote.model';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryLikeRemvedEvent, CategoryLikedEvent } from '../../../voting/voting-module.event';
import { first } from 'rxjs';
import { mergeDeep } from '../../../../shared/utils/merge';
import { SimpleLikingComponent } from '../../../voting/simple-likeing/simple-likeing.component';

@Component({
  selector: 'category-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    CategoryListItemContextMenuComponent,
    SimpleLikingComponent
  ],
  templateUrl: './category-list-item.component.html',
  styleUrl: './category-list-item.component.scss'
})
export class CategoriesListItemComponent {
  private destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(CategoryVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() category!: Category;

  // CONTEXT MENU
  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(CategoriesListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }


  // CONFIG
  @Input() set config(config: any) {
    this._config = mergeDeep(this._config, config);
  }
  _config: Config = {
    contextMenu: {
      enable: true,
    },
    voting: true,
    open: true,
  }
}
class Config {
  contextMenu!: {
    enable: boolean;
  };
  voting!: boolean;
  open!: boolean;
}
