import { Component, DestroyRef, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Topic } from '../../topic.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventBusService } from '../../../../service/event-bus.service';
import { ShowTopicDetailsModalEvent } from '../../topic-module.event';
import { TopicListItemContextMenuComponent } from './topic-list-item-context-menu/topic-list-item-context-menu.component';
import { NGXLogger } from 'ngx-logger';
import { UserProfileComponent } from '../../../user/user-profile/user-profile.component';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';
import { TopicVotingService } from '../../../voting/topic-voting.service';
import { AuthenticationService } from '../../../../auth/authentication.service';
import { TopicLikeRemvedEvent, TopicLikedEvent } from '../../../voting/voting-module.event';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { DomainObjectType, Vote } from '../../../voting/vote.model';
import { SimpleLikingComponent } from '../../../voting/simple-liking/simple-liking.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { first } from 'rxjs';

@Component({
  selector: 'topic-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    TopicListItemContextMenuComponent,
    UserProfile2Component,
    SimpleLikingComponent
  ],
  templateUrl: './topic-list-item.component.html',
  styleUrl: './topic-list-item.component.scss'
})
export class TopicListItemComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(TopicVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() topic!: Topic;
  vote?: Vote;

  ngOnInit(): void {
    this.getVote();
  }

  // MODAL 
  openTopicDetailsModal(topicId: string) {
    this.logger.debug(TopicListItemComponent.name, " openTopicDetailsModal()");
    this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  }

  // CONTEXT MENU
  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(TopicListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }

  // VOTING
  getVote() {
    this.logger.debug(TopicListItemComponent.name, " getVote()");
    this.votingQueryService.get(DomainObjectType.TOPIC, this.topic.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: vote => {
        this.vote = vote;
      },
    });
  }

  like(id: string) {
    this.logger.debug(TopicListItemComponent.name, " like()");
    this.votingService.createLike(id)
  }
  removeLike(id: string) {
    this.logger.debug(TopicListItemComponent.name, " removeLike()");
    this.votingService.deleteLikeAndDislike(id);
  }
}
