import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { Group } from '../../group.model';
import { DomainObjectType, Vote } from '../../../voting/vote.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupVotingService } from '../../../voting/group-voting.service';
import { SimpleLikingComponent } from '../../../voting/simple-liking/simple-liking.component';
import { GroupListItemContextMenuComponent } from './group-list-item-context-menu/group-list-item-context-menu.component';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';
import { ShowGroupDetailsModalEvent } from '../../group-module.event';

@Component({
  selector: 'group-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    SimpleLikingComponent,
    GroupListItemContextMenuComponent,
    UserProfile2Component,
  ],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(GroupVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() group!: Group;
  vote?: Vote;

  ngOnInit(): void {
    this.getVote();
  }

  // MODAL 
  openDetailsModal(modelId: string) {
    this.logger.debug(GroupListItemComponent.name, " openDetailsModal()");
    this.eventBus.emit(ShowGroupDetailsModalEvent.name, new ShowGroupDetailsModalEvent(modelId));
  }

  // CONTEXT MENU
  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(GroupListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }

  // VOTING
  getVote() {
    this.logger.debug(GroupListItemComponent.name, " getVote()");
    this.votingQueryService.get(DomainObjectType.GROUP, this.group.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: vote => {
        this.vote = vote;
      },
    });
  }

  like(id: string) {
    this.logger.debug(GroupListItemComponent.name, " like()");
    this.votingService.createLike(id)
  }
  removeLike(id: string) {
    this.logger.debug(GroupListItemComponent.name, " removeLike()");
    this.votingService.deleteLikeAndDislike(id);
  }
}
