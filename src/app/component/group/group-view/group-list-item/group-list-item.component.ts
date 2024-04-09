import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../service/event-bus.service';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { Group } from '../../group.model';

@Component({
  selector: 'group-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  // votingService = inject(GroupVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() group!: Group;
  // vote?: Vote;

  ngOnInit(): void {
    // this.getVote();
  }

  // // MODAL 
  // openTopicDetailsModal(topicId: string) {
  //   this.logger.debug(TopicListItemComponent.name, " openTopicDetailsModal()");
  //   this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  // }

  // CONTEXT MENU
  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(GroupListItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }

  // // VOTING
  // getVote() {
  //   this.logger.debug(GroupListItemComponent.name, " getVote()");
  //   this.votingQueryService.get(DomainObjectType.TOPIC, this.topic.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
  //     next: vote => {
  //       this.vote = vote;
  //     },
  //   });
  // }

  // like(id: string) {
  //   this.logger.debug(GroupListItemComponent.name, " like()");
  //   this.votingService.createLike(id).pipe(first()).subscribe({
  //     next: res => {
  //       this.logger.debug(TopicListItemComponent.name, " User give like ");
  //       this.eventBus.emit(TopicLikedEvent.name, new TopicLikedEvent(id));
  //     }
  //   });
  // }
  // removeLike(id: string) {
  //   this.logger.debug(GroupListItemComponent.name, " removeLike()");
  //   this.votingService.deleteLikeAndDislike(id).pipe(first()).subscribe({
  //     next: res => {
  //       this.logger.debug(GroupListItemComponent.name, " User removed like ");
  //       this.eventBus.emit(TopicLikeRemvedEvent.name, new TopicLikeRemvedEvent(id));
  //     }
  //   });
  // }

}
