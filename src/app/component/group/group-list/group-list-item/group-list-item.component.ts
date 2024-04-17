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
import { GroupListItemContextMenuComponent } from './group-list-item-context-menu/group-list-item-context-menu.component';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';
import { ShowGroupDetailsModalEvent } from '../../group-module.event';
import { mergeDeep } from '../../../../shared/utils/merge';
import { SimpleLikingComponent } from '../../../voting/simple-likeing/simple-likeing.component';

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
export class GroupListItemComponent {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(GroupVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() group!: Group;

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
  modal!: boolean;
  voting!: boolean;
  open!: boolean;
}
