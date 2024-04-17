import { Component, DestroyRef, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Topic } from '../../topic.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { ShowTopicDetailsModalEvent } from '../../topic-module.event';
import { TopicListItemContextMenuComponent } from './topic-list-item-context-menu/topic-list-item-context-menu.component';
import { NGXLogger } from 'ngx-logger';
import { UserProfileComponent } from '../../../user/user-profile/user-profile.component';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';
import { TopicVotingService } from '../../../voting/topic-voting.service';
import { AuthenticationService } from '../../../../auth/authentication.service';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { DomainObjectType, Vote } from '../../../voting/vote.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { first } from 'rxjs';
import { mergeDeep } from '../../../../shared/utils/merge';
import { SimpleLikingComponent } from '../../../voting/simple-likeing/simple-likeing.component';

@Component({
  selector: 'topic-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    TopicListItemContextMenuComponent,
    UserProfile2Component,
    SimpleLikingComponent,
  ],
  templateUrl: './topic-list-item.component.html',
  styleUrl: './topic-list-item.component.scss'
})
export class TopicListItemComponent {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(TopicVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() topic!: Topic;

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

  // CONFIG
  @Input() set config(config: any) {
    this._config = mergeDeep(this._config, config);
  }
  _config: Config = {
    contextMenu: {
      enable: true,
    },
    modal: true,
    voting: true,
    open: true,
  }
}
class Config {
  contextMenu!: {
    enable: boolean;
  };
  modal!:boolean;
  voting!: boolean;
  open!: boolean;
}
