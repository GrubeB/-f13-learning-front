import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, Input, inject } from '@angular/core';
import { Reference } from '../../reference.model';
import { AuthenticationService } from '../../../../auth/authentication.service';
import { ReferenceVotingService } from '../../../voting/reference-voting.service';
import { take } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../service/event-bus.service';
import { ReferenceItemContextMenuComponent } from './reference-item-context-menu/reference-item-context-menu.component';
import { ReferenceDislikedEvent, ReferenceLikeDislikRemovedEvent, ReferenceLikedEvent } from '../../../voting/voting-module.event';

@Component({
  selector: 'reference-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReferenceItemContextMenuComponent
  ],
  templateUrl: './reference-item.component.html',
  styleUrl: './reference-item.component.scss'
})
export class ReferenceItemComponent {
  authenticationService = inject(AuthenticationService);
  votingService = inject(ReferenceVotingService);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);

  @Input() reference!: Reference;

  contextMenuVisable: boolean = false;
  toggleContextMenu() {
    this.logger.debug(ReferenceItemComponent.name, " toggleContextMenu()");
    this.contextMenuVisable = !this.contextMenuVisable;
  }

  openReference(): void {
    this.logger.debug(ReferenceItemComponent.name, " openReference()");
    window.open(this.reference.link, '_blank');
  }

  like(referenceId: string) {
    this.logger.debug(ReferenceItemComponent.name, " like()");
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.createLike(referenceId, userId).subscribe({
            next: res => {
              this.logger.debug(ReferenceItemComponent.name, " User give like ");
              this.eventBus.emit(ReferenceLikedEvent.name, new ReferenceLikedEvent(referenceId, userId));
            }
          });
        }
      }
    });
  }

  dislike(referenceId: string) {
    this.logger.debug(ReferenceItemComponent.name, " dislike()");
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.createDislike(referenceId, userId).subscribe({
            next: res => {
              this.logger.debug(ReferenceItemComponent.name, " User give dislike ");
              this.eventBus.emit(ReferenceDislikedEvent.name, new ReferenceDislikedEvent(referenceId, userId));
            }
          });
        }
      }
    });
  }
  removeLikeDislike(referenceId: string) {
    this.logger.debug(ReferenceItemComponent.name, " removeLikeDislike()");
    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId != null) {
          this.votingService.deleteLikeAndDislike(referenceId, userId).subscribe({
            next: res => {
              this.logger.debug(ReferenceItemComponent.name, " User removed like/dislike ");
              this.eventBus.emit(ReferenceLikeDislikRemovedEvent.name, new ReferenceLikeDislikRemovedEvent(referenceId, userId));
            }
          });
        }
      }
    });
  }
}
