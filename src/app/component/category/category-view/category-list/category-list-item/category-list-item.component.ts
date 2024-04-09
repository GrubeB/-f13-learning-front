import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CategoryListItemContextMenuComponent } from './category-list-item-context-menu/category-list-item-context-menu.component';
import { EventBusService } from '../../../../../service/event-bus.service';
import { Category } from '../../../category.model';
import { CategoryVotingService } from '../../../../voting/category-voting.service';
import { DomainObjectType, Vote } from '../../../../voting/vote.model';
import { VotingQueryService } from '../../../../voting/voting-query.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryLikeRemvedEvent, CategoryLikedEvent } from '../../../../voting/voting-module.event';
import { first } from 'rxjs';
import { SimpleLikingComponent } from '../../../../voting/simple-liking/simple-liking.component';

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
export class CategoriesListItemComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(CategoryVotingService);
  votingQueryService = inject(VotingQueryService);
  
  @Input() category!: Category;
  vote?: Vote;

  ngOnInit(): void {
    this.getVote();
  }

  // CONTEXT MENU
  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(CategoriesListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }

  // VOTING
  getVote() {
    this.logger.debug(CategoriesListItemComponent.name, " getVote()");
    this.votingQueryService.get(DomainObjectType.CATEGORY, this.category.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: vote => {
        this.vote = vote;
      },
    });
  }

  like(id: string) {
    this.logger.debug(CategoriesListItemComponent.name, " like()");
    this.votingService.createLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.debug(CategoriesListItemComponent.name, " User give like ");
        this.eventBus.emit(CategoryLikedEvent.name, new CategoryLikedEvent(id));
      }
    });
  }
  removeLike(id: string) {
    this.logger.debug(CategoriesListItemComponent.name, " removeLike()");
    this.votingService.deleteLikeAndDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.debug(CategoriesListItemComponent.name, " User removed like ");
        this.eventBus.emit(CategoryLikeRemvedEvent.name, new CategoryLikeRemvedEvent(id));
      }
    });
  }
}
