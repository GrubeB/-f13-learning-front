import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Topic } from '../../../topic.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventBusService } from '../../../../../service/event-bus.service';
import { ShowTopicDetailsModalEvent } from '../../../topic-module.event';
import { TopicListItemContextMenuComponent } from './topic-list-item-context-menu/topic-list-item-context-menu.component';
import { NGXLogger } from 'ngx-logger';
import { UserProfileComponent } from '../../../../user/user-profile/user-profile.component';
import { UserProfile2Component } from '../../../../user/user-profile-2/user-profile-2.component';
import { TopicVotingService } from '../../../../voting/topic-voting.service';
import { AuthenticationService } from '../../../../../auth/authentication.service';
import { TopicLikeRemvedEvent, TopicLikedEvent } from '../../../../voting/voting-module.event';
import { VotingQueryService } from '../../../../voting/voting-query.service';
import { DomainObjectType, Vote } from '../../../../voting/vote.model';
import { SimpleLikingComponent } from '../../../../voting/simple-liking/simple-liking.component';

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
export class TopicListItemComponent implements OnInit{
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(TopicVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() topic!: Topic;
  vote?: Vote;

  ngOnInit(): void {
    this.getVote();
  }

  getVote() {
    this.logger.debug(TopicListItemComponent.name, " getVote()");
    this.votingQueryService.get(this.topic.id, DomainObjectType.TOPIC).subscribe({
      next: vote => {
        this.logger.debug(TopicListItemComponent.name, " getVote() - refresh ", vote);
        this.vote = vote;
      },
    });
  }

  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(TopicListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }
  
  openTopicDetailsModal(topicId: string) {
    this.logger.debug(TopicListItemComponent.name, " openTopicDetailsModal()");
    this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  }
  // VOTING
  like(id: string) {
    this.logger.debug(TopicListItemComponent.name, " like()");
    this.votingService.createLike(id).subscribe({
      next: res => {
        this.logger.debug(TopicListItemComponent.name, " User give like ");
        this.eventBus.emit(TopicLikedEvent.name, new TopicLikedEvent(id));
      }
    });
  }
  removeLike(id: string) {
    this.logger.debug(TopicListItemComponent.name, " removeLike()");
    this.votingService.deleteLikeAndDislike(id).subscribe({
      next: res => {
        this.logger.debug(TopicListItemComponent.name, " User removed like ");
        this.eventBus.emit(TopicLikeRemvedEvent.name, new TopicLikeRemvedEvent(id));
      }
    });
  }
}
