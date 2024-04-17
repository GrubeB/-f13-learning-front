import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { DomainObjectType, Vote } from '../../../voting/vote.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfile2Component } from '../../../user/user-profile-2/user-profile-2.component';
import { mergeDeep } from '../../../../shared/utils/merge';
import { PathListItemContextMenuComponent } from './path-list-item-context-menu/path-list-item-context-menu.component';
import { Path } from '../../path.model';
import { ShowPathDetailsModalEvent } from '../../path-module.event';
import { PathVotingService } from '../../../voting/path-voting.service';
import { SimpleLikingComponent } from '../../../voting/simple-likeing/simple-likeing.component';


@Component({
  selector: 'path-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    SimpleLikingComponent,
    PathListItemContextMenuComponent,
    UserProfile2Component,
  ],
  templateUrl: './path-list-item.component.html',
  styleUrl: './path-list-item.component.scss'
})
export class PathListItemComponent {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingService = inject(PathVotingService);
  votingQueryService = inject(VotingQueryService);

  @Input() item!: Path;

  // MODAL 
  openDetailsModal(modelId: string) {
    this.logger.debug(PathListItemComponent.name, " openDetailsModal()");
    this.eventBus.emit(ShowPathDetailsModalEvent.name, new ShowPathDetailsModalEvent(modelId));
  }

  // CONTEXT MENU
  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(PathListItemComponent.name, " toggleContextMenu()");
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
