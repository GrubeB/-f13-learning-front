import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
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

@Component({
  selector: 'topic-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    TopicListItemContextMenuComponent,
    UserProfile2Component
  ],
  templateUrl: './topic-list-item.component.html',
  styleUrl: './topic-list-item.component.scss'
})
export class TopicListItemComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(TopicVotingService);
  authenticationService = inject(AuthenticationService);

  @Input() topic!: Topic;

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
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.createLike(id, userId).subscribe({
            next: res => {
              this.logger.debug(TopicListItemComponent.name, " User give like ");
              this.eventBus.emit(TopicLikedEvent.name, new TopicLikedEvent(id, userId));
            }
          });
        }
      }
    });
  }
  removeLike(id: string) {
    this.logger.debug(TopicListItemComponent.name, " removeLike()");
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.deleteLikeAndDislike(id, userId).subscribe({
            next: res => {
              this.logger.debug(TopicListItemComponent.name, " User removed like ");
              this.eventBus.emit(TopicLikeRemvedEvent.name, new TopicLikeRemvedEvent(id, userId));
            }
          });
        }
      }
    });
  }
}
